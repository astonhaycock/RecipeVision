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
} from "./env";

const openai = new OpenAI({ apiKey: OPENAI_KEY });

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

declare module "express-session" {
  interface SessionData {
    user_id: Types.ObjectId;
    user: IUser;
  }
}

interface AuthCredentials {
  email: string;
  password: string;
}

async function autenthicate(
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

app.use(autenthicate);

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

app.get("/api/session", autenthicate, async (req: Request, res: Response) => {
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
  let user = new User({ email: creds.email });
  user.setPassword(creds.password);
  await user.save();
  res.status(201).send("user created");
});

app.post("/api/image", autenthicate, async (req: Request, res: Response) => {
  if (
    (req.session.user as IUser).last_request > new Date(Date.now() - RATE_LIMIT)
  ) {
    res.status(429).send("rate limited");
    return;
  }
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}/`);
});
