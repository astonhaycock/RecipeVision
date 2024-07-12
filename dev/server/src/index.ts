// Import the necessary modules
// Express for HTTP routing
import express from "express";
import type { Request, Response, NextFunction } from "express";
// The Express session plugin
import session from "express-session";
// The MongoDB session store for the Express session plugin
import MongoStore from "connect-mongo";
// The Express CORS plugin
import cors from "cors";
// Node.js fs module for creating directories and deleting files
import { mkdir, unlink } from "node:fs/promises";
// Obvious
import OpenAI from "openai";

// Schemas and MongoDB models
import { User, Recipe, DB, type IUser } from "./model";
import type { ObjectId, Types } from "mongoose";

// Environment variables
import {
  PORT,
  RATE_LIMIT,
  WEBSITE_PATH,
  IMAGES_PATH,
  PUBLIC_URL,
  OPENAI_KEY,
  MONGODB_URL,
  SESSION_SECRET,
  FILE_LIMIT,
} from "./env";
import multer from "multer";

const openai = new OpenAI({ apiKey: OPENAI_KEY });

// Extend the Express session data to include the user ID and user object
declare module "express-session" {
  interface SessionData {
    user_id: Types.ObjectId;
    user: IUser;
  }
}
// The credentials for logging in or registering
interface AuthCredentials {
  email: string;
  password: string;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_PATH);
  },
  filename: (req, file, cb) => {
    // Generate a hash from the current date and time, plus the file name.
    // It's not perfect, but it's good enough for now.
    // Proper hashing is a pain with Multer. It was much easier with Elysia.
    let hasher = new Bun.CryptoHasher("md5");
    hasher.update(Date.now().toString());
    hasher.update(file.originalname);
    let hash = hasher.digest("hex");
    let file_ext = file.mimetype.split("/")[1];
    cb(null, `${hash}.${file_ext}`);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: FILE_LIMIT },
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
    cb(null, true);
  },
});

/// Sort a list and deduplicate items
function dedup<T>(list: Array<T>, fn?: (a: T, b: T) => number) {
  list.sort(fn);
  for (let i = list.length - 1; i > 0; i--) {
    if (list[i] === list[i - 1]) {
      list[i] = list[list.length - 1];
      list.pop();
    }
  }
}

// Since the images folder is temporary and Git won't store empty folders,
// we need to create the folder if it doesn't exist
await mkdir(IMAGES_PATH, { recursive: true }).catch(console.error);

// Create the Express app
const app = express();
app.use(cors());
app.use(express.static(WEBSITE_PATH));
app.use("/images", express.static(IMAGES_PATH));
app.use(
  session({
    secret: SESSION_SECRET,
    store: MongoStore.create({ mongoUrl: MONGODB_URL }),
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
    resave: false,
    saveUninitialized: false,
  })
);

async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.session || !req.session.user_id) {
    res.status(401).send("unauthorized");
    return;
  }
  const user = await User.findById(req.session.user_id);
  if (!user) {
    res.status(401).send("unauthorized");
    return;
  }
  req.session.user = user;
}

// app.use(authenticate);

app.post("/api/session", async (req: Request, res: Response) => {
  if (!req.session) {
    res.status(500).send();
    return;
  }
  let creds = req.body as AuthCredentials;
  if (creds === undefined) {
    res.status(400).send("log in with email and password as a json object");
    return;
  }
  let user = await User.findOne({ email: creds.email });
  if (!user) {
    res.status(401).send("incorrect email or password");
    return;
  }
  if (!user.verifyPassword(creds.password)) {
    res.status(401).send("incorrect email or password");
    return;
  }
  req.session.user_id = user._id;
  //TODO: return user info
  res.status(201).send("logged in");
});

app.get("/api/session", authenticate, async (req: Request, res: Response) => {
  //TODO: return user info
  res.status(200).send("logged in");
});

app.post("/api/user", async (req: Request, res: Response) => {
  let creds = req.body as AuthCredentials;
  if (creds === undefined) {
    res.status(400).send("register with email and password as a json object");
    return;
  }
  let existing = await User.findOne({ email: creds.email });
  if (existing) {
    res.status(409).send("user already exists");
    return;
  }
  let user = new User({
    email: creds.email,
    last_request: Date.now() - RATE_LIMIT,
  });
  user.setPassword(creds.password);
  await user.save();
  res.status(201).send("user created");
});

app.post(
  "/api/image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    // if (
    //   (req.session.user as IUser).last_request > new Date(Date.now() - RATE_LIMIT)
    // ) {
    //   res.status(429).send("rate limited");
    //   return;
    // }
    if (req.file === undefined) {
      res.status(400).send("no image provided");
      return;
    }
    let file = req.file as Express.Multer.File;
    setInterval(() => {
      unlink(file.path).catch(console.error);
    }, 15_000);
    let url = `${PUBLIC_URL}/images/${req.file.filename}`;
    console.log(`uploaded image: ${url}`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Give me a list of cooking ingredients in this image, if any, as a JSON array of strings. If no ingredients are present, return an empty JSON array. Keep each ingredient generic and do not include brand information. Return only the JSON array, with no description, context, or formatting.",
            },
            {
              type: "image_url",
              image_url: { url: url, detail: "high" },
            },
          ],
        },
      ],
    });
    console.log(response.choices[0].message.content);
    try {
      const list = await JSON.parse(
        // we're in a try/catch block, and we want to fail loudly if it's not a string.
        response.choices[0].message.content as string
      );
      if (!Array.isArray(list) || list.some((i) => typeof i !== "string")) {
        throw new Error();
      }
      dedup(list);
      res.status(201).send(list);
    } catch {
      res.status(500).send("failed to parse AI response");
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}/`);
});
