import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import { promises as fs } from "fs";
import multer from "multer";
import { User, IUser } from "./model"; // Ensure your model file exports IUser interface

const upload = multer({ dest: "images/" });

// Configuration for paths
const WEBSITE_PATH = "../client";
const IMAGES_PATH = "../images";

// Create and configure the Express app
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
  const user = await User.findById(req.session.user_id);
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }
  req.user = user;
  next();
}

// API routes
app.post("/api/session", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = (await User.findOne({ email })) as IUser;
  if (!user || !user.verifyPassword(password)) {
    res.status(401).send("Unauthorized");
    return;
  }
  req.session.user_id = user._id;
  res.status(201).send({ user_id: user._id, user_email: email });
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
      // Image processing and AI integration goes here
      res.status(200).send({
        url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      });
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

// Ensure images directory exists
fs.mkdir(IMAGES_PATH, { recursive: true }).catch(console.error);
