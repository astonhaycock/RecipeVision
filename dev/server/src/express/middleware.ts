// This file defines the middlewares and their settings. Several custom middlewares
// are defined here, including the authentication middleware.
// Global middlewares are added in the `init` function, which is called from `server.ts`.
// Middlewares to be selectively applied are returned for use in other files.

import cors from "cors";
import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import multer from "multer";
import {
  IMAGES_PATH,
  FILE_LIMIT,
  SESSION_SECRET,
  MONGODB_URL,
  COOKIE_EXPIRATION,
} from "../env";
import MongoStore from "connect-mongo";
import session from "express-session";
import { Users, type User } from "../model";
import { dedup, list_valid } from "../utils";

// Enable CORS for all requests
const cors_mw = cors();

// Use body-parser to parse JSON request bodies
const body_parser_mw = express.json();

// Create the Multer storage engine, specifying the destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // The destination is the images folder
    cb(null, IMAGES_PATH);
  },
  filename: (req, file, cb) => {
    // Generate a hash from the current date and time and the file name.
    // It's not perfect, but it's enough for temporary image names.
    // Proper hashing is a pain with Multer. It was much easier with Elysia.
    // I could also generate a UUID, but I'd need to import another module.
    // This is fast enough.

    // md5 hashing for its speed and simplicity
    let hasher = new Bun.CryptoHasher("md5");
    // Update the hash with the current time
    hasher.update(Date.now().toString());
    // Update the hash with the original file name
    hasher.update(file.originalname);
    // Finish computing the hash and convert it to hexadecimal
    let hash = hasher.digest("hex");
    // Split the MIME type and get the file extension
    let file_ext = file.mimetype.split("/")[1];
    // Combine the hash and the file extension as the image name
    cb(null, `${hash}.${file_ext}`);
  },
});

// Create the Multer upload handler with the storage engine
const image_mw = multer({
  // The storage object created above.
  storage: storage,
  // The file size limit specified in env.ts
  limits: { fileSize: FILE_LIMIT },
  // Ensure the file is a png or jpeg before saving it to the disk.
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      //TODO: if we're not throwing errors, we should document the behavior for the user
      cb(null, false);
      // cb(new Error("only images are allowed"));
      return;
    }
    if (!(file.mimetype.endsWith("jpeg") || file.mimetype.endsWith("png"))) {
      cb(null, false);
      // cb(new Error("only JPEG and PNG images are allowed"));
      return;
    }
    // At this point, the file is an image, so we signal that it's okay to save it.
    cb(null, true);
  },
});

// Configure the session middleware
const session_mw = session({
  secret: SESSION_SECRET,
  store: MongoStore.create({ mongoUrl: MONGODB_URL }),
  cookie: { maxAge: COOKIE_EXPIRATION },
  resave: false,
  saveUninitialized: true,
});

/**
 * This middleware handles the sanitization of incoming lists.
 * This makes the following guarantees:
 * - The list is an array of non-empty strings.
 * - The list has no duplicate entries.
 * - Each string has no illegal symbols, capitals, or numbers.
 * - Each string in the list is 50 characters or less.
 * - Each string has no leading or trailing whitespace, and never more than one space in a row.
 * @param list_name The name or names of the list(s) to sanitize.
 * @returns The middleware to be passed to the Express app.
 */
function list_mw(list_name: string | string[]) {
  if (typeof list_name === "string") {
    return async (req: Request, res: Response, next: NextFunction) => {
      const result = list_valid(req.body[list_name]);
      if (result) {
        res.status(400).send(`invalid list: ${result}`);
        return;
      }
      if (req.body[list_name].length === 0) {
        res.status(400).send(`no useable data in list`);
        return;
      }
      req.body[list_name] = dedup(req.body[list_name] as string[]);
      next();
    };
  } else {
    return async (req: Request, res: Response, next: NextFunction) => {
      for (const name of list_name) {
        const result = list_valid(req.body[name]);
        if (result) {
          res.status(400).send(`invalid ${name} list: ${result}`);
          return;
        }
        const list = req.body[name] as string[];
        if (list.length === 0) {
          res.status(400).send(`no useable data in ${name} list`);
          return;
        }
        req.body[name] = dedup(list);
        next();
      }
    };
  }
}

// Create the authentication middleware
/// Authenticate the user by checking the session, then checking the database to ensure the user
/// exists. If the user is not found, or the session is invalid, return a 401 Unauthorized status.
async function authenticate_mw(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.session) {
    res.status(500).send("internal server error");
    return;
  }
  if (!req.session.user_id) {
    res.status(401).send("unauthorized");
    return;
  }
  if (req.user === null) {
    console.log("user not found in session");
    res.status(500).send("internal server error");
    return;
  }
  // Get the user from the database
  const result = Users.findByIdAndPopulate(req.session.user_id);
  if (!result) {
    res.status(500).send("internal server error");
    return;
  }
  const user = await result;
  if (!user) {
    res.status(401).send("unauthorized");
    return;
  }
  // Add the user object to the session so other functions can access it later
  req.user = user as User;
  next();
}

function ratelimit_mw(millis: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const time = user.last_request.getTime();
    const current = new Date().getTime();
    if (current - time < millis) {
      res.status(429).send("too many requests");
      return;
    }
    user.last_request = new Date();
    user.save();
    next();
  };
}

async function inspection_mw(req: Request, res: Response, next: NextFunction) {
  console.log(`[${req.method}] ${req.path}`);
  next();
}

/**
 * Middleware to allow requests without authentication if the request path matches the given condition.
 * This is to allow previews of certain content without requiring a login.
 * @param check The function should return true if the request is allowed without authentication.
 */
function no_auth_if_mw(check: (req: Request) => boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (check(req)) {
      next();
    } else {
      authenticate_mw(req, res, next);
    }
  };
}

function init(app: Express) {
  app.use(session_mw);
  app.use(cors_mw);
  app.use(body_parser_mw);
  // app.use(inspection_mw);
}

export {
  init,
  image_mw,
  authenticate_mw,
  list_mw,
  ratelimit_mw,
  no_auth_if_mw,
};
