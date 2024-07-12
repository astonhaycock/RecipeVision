import express from "express";
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import { promises as fs } from "fs";
import multer from "multer";
import { User, Recipe, DB } from "./model";
import OpenAI from "openai";

const WEBSITE_PATH = "../client";
const IMAGES_PATH = "../images";

const openai = new OpenAI({ apiKey: process.env.AIPASSWORD });

const upload = multer({ dest: IMAGES_PATH });

// Ensure images directory exists
fs.mkdir(IMAGES_PATH, { recursive: true }).catch(console.error);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(WEBSITE_PATH));
app.use("/images", express.static(IMAGES_PATH));
app.use(
  session({
    secret: "your-secret-key",
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/yourdb" }),
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
    resave: false,
    saveUninitialized: false,
  })
);

declare module "express-session" {
  interface SessionData {
    user_id: string;
    user_email: string;
  }
}

interface IUser extends mongoose.Document {
  email: string;
  verifyPassword: (password: string) => boolean;
  setPassword: (password: string) => void;
}

// Middleware for session checking
async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.session || !req.session.user_id) {
    res.status(401).send("Unauthorized");
    return;
  }
  const user = (await User.findById(req.session.user_id)) as IUser;
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }
  req.user = user;
  next();
}

// Sort a list and deduplicate items
function dedup<T>(list: Array<T>, fn?: (a: T, b: T) => number) {
  list.sort(fn);
  for (let i = list.length - 1; i > 0; i--) {
    if (list[i] === list[i - 1]) {
      list[i] = list[list.length - 1];
      list.pop();
    }
  }
}

// API routes
app.post("/api/session", async (req: Request, res: Response) => {
  console.log("Hi!");
  const { email, password } = req.body;
  console.log("Hi!");
  const user = (await User.findOne({ email })) as IUser;
  console.log("Hi!");
  if (!user || !user.verifyPassword(password)) {
    console.log("Hi!");
    res.status(401).send("Unauthorized");
    console.log("Hi!");
    return;
    console.log("Hi!");
  }
  console.log("Hi!");
  req.session.user_id = user._id.toString();
  console.log("Hi!");
  req.session.user_email = email;
  console.log("Hi!");
  res.status(201).send({ user_id: user._id, user_email: email });
  console.log("Hi!");
});

app.post("/api/user", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (await User.findOne({ email })) {
    res.status(409).send("Email in use");
    return;
  }
  const newUser = new User({ email }) as IUser;
  newUser.setPassword(password);
  try {
    await newUser.save();
    res.status(201).send("Success");
  } catch (e) {
    console.error(e);
    res.status(500).send("Failed to create user");
  }
});

app.post(
  "/api/image",
  upload.single("image"),
  authenticate,
  async (req: Request, res: Response) => {
    if (req.file) {
      const imagePath = `${IMAGES_PATH}/${req.file.filename}`;
      console.log(`Connection from ${req.session.user_email}`);

      // Hash the image and get the extension
      const hash = require("crypto")
        .createHash("sha256")
        .update(await fs.readFile(imagePath))
        .digest("hex");
      const ext = req.file.mimetype.split("/")[1];
      const filename = `${hash}.${ext}`;

      const fileExists = await fs
        .stat(`${IMAGES_PATH}/${filename}`)
        .catch(() => false);
      if (fileExists && Date.now() - fileExists.mtimeMs > 60_000) {
        await fs.unlink(`${IMAGES_PATH}/${filename}`);
      } else if (fileExists) {
        res.status(400).send("file already processing - be patient");
        return;
      }

      await fs.rename(imagePath, `${IMAGES_PATH}/${filename}`);
      const url = `${process.env.PUBLIC_URL}/images/${filename}`;
      console.log(url);

      // Placeholder for OpenAI API call
      return res.status(200).send("function stopped before using OpenAI call");

      // const response = await openai.chat.completions.create({
      //     model: "gpt-4o",
      //     messages: [
      //         {
      //             role: "user",
      //             content: [
      //                 {
      //                     type: "text",
      //                     text: "Give me a list of cooking ingredients in this image, if any, as a JSON array of strings. If no ingredients are present, return an empty JSON array. Keep each ingredient generic and do not include brand information. Return only the JSON array, with no description, context, or formatting.",
      //                 },
      //                 {
      //                     type: "image_url",
      //                     image_url: { url: url, detail: "high" },
      //                 },
      //             ],
      //         },
      //     ],
      // });
      // console.log(response.choices[0].message.content);
      // await fs.unlink(`${IMAGES_PATH}/${filename}`);
      // try {
      //     const list = await JSON.parse(
      //         typeof response.choices[0].message.content === "string"
      //             ? response.choices[0].message.content.toLowerCase()
      //             : "[]"
      //     );
      //     // ensure list is an array of strings
      //     if (!Array.isArray(list) || list.some((i) => typeof i !== "string")) {
      //         throw new Error();
      //     }
      //     dedup(list);
      //     res.status(200).send(list);
      // } catch {
      //     res.status(500).send('failed to parse AI response');
      // }
    } else {
      res.status(400).send("No image uploaded");
    }
  }
);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
