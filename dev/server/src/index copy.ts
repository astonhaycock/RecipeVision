/// The directory path of the compiled website
const WEBSITE_PATH = "../client";
/// The directory path of the images temp folder
const IMAGES_PATH = "../images";
/// The rate limit on image uploads for registered users
/// in milliseconds between uploads
// 15_000 is 15 seconds
const RATE_LIMIT = 15_000;

// Import the necessary modules
// Express for HTTP routing
import express, { Express, Request, Response, Application } from "express";
// The Express static plugin for serving static files and folders
import { staticPlugin } from "@express/static";
// The Express CORS plugin
import { cors } from "@express/cors";
// Node.js fs module for creating directories and deleting files
import { mkdir, unlink } from "node:fs/promises";
// Obvious
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.AIPASSWORD });

// Schemas and MongoDB models
import { User, Recipe, DB } from "../model";

// Interface merging to enforce environment variables
declare module "bun" {
  interface Env {
    /// The OpenAI authentication key
    AIPASSWORD: string;
    /// The public URL of the server
    PUBLIC_URL: string;
  }
}

// Validate the environment variables
try {
  if (Bun.env.PUBLIC_URL.length === 0) {
    throw new Error();
  }
} catch (_) {
  console.error("PUBLIC_URL is required in the .env file");
}
try {
  if (Bun.env.AIPASSWORD.length === 0) {
    throw new Error();
  }
} catch (_) {
  console.error("AIPASSWORD is required in the .env file");
}

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
await mkdir(IMAGES_PATH, { recursive: true });

// Create the Express app
const app = express();
const port =
