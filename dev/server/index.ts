/// The directory path of the compiled website
const WEBSITE_PATH = "../client";
/// The directory path of the images temp folder
const IMAGES_PATH = "../images";

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

// Import the necessary modules
// Elysia for HTTP routing
import { Elysia, error, t } from "elysia";
// The Elysia static plugin for serving static files and folders
import { staticPlugin } from "@elysiajs/static";
// The Elysia CORS plugin
import { cors } from '@elysiajs/cors';
// Node.js fs module for creating directories and deleting files
import { mkdir, unlink } from "node:fs/promises";
// Obvious
import OpenAI from "openai";
const openai = new OpenAI({apiKey: process.env.AIPASSWORD});

// Schemas and MongoDB models
import { User, Recipe } from "./model";

// Since the images folder is temporary and Git won't store empty folders,
// we need to create the folder if it doesn't exist
await mkdir(IMAGES_PATH, { recursive: true });

// Create the Elysia app instance.
// Uses method chaining to add routes, settings, and plugins
const app = new Elysia()
  .use(cors())
  // The `group` method allows for grouping routes under a common prefix
  // In this case, all routes under `/api` will be grouped together.
  // Inside the callback, we use the same method chaining format to add routes.
  .group('/api', app =>
    // The inner variable `app` is an Elysia instance containing the path,
    // but with `/api` removed.

      app
        .post("/image", async ({body:{image}}) => {
            console.log(image[0]);
            console.log("Image received");
            // Ensure exactly one image is uploaded
            if (image.length !== 1) {
                return error(400, "exactly one image is required");
            }
            // Check if the file is an image
            if (image[0].type.substring(0, 6) !== "image/") {
                return error(400, `expected image, got ${image[0].type}`);
            }

            // Hash the image and get the extension
            const hash = Bun.hash(await image[0].arrayBuffer())
            const ext = image[0].type.substring(6);
            // Combine them into a filename
            const filename = `${hash.toString(16).padStart(16, "0")}.${ext}`;
            // Check if the file already exists, delete it if it's too old
            let file = Bun.file(`${IMAGES_PATH}/${filename}`);
            if (await file.exists()) {
              console.log(Date.now());
              console.log(file.lastModified);
              if (Date.now() - (file.lastModified) > 60_000) {
                unlink(`${IMAGES_PATH}/${filename}`)
              }
              return error(400, "file already processing - be patient");
            }
            // Save the file
            Bun.write(`${IMAGES_PATH}/${filename}`, image[0]);
            const url = `${Bun.env.PUBLIC_URL}/images/${filename}`;
            console.log(url);
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {type: "text", text: "Give me a list of cooking ingredients in this image, if any, as a JSON array of strings. If no ingredients are present, return an empty JSON array. Keep each ingredient generic and do not include brand information. Return only the JSON array, with no description, context, or formatting."},
                            {type: "image_url", image_url: {url: url, detail: "high"}}
                        ]
                    }
                ]
            });
            console.log(response.choices[0].message.content);
            unlink(`${IMAGES_PATH}/${filename}`);
            try {
              const list = await JSON.parse(typeof response.choices[0].message.content === "string" ? response.choices[0].message.content.toLowerCase() : "[]");
              // ensure list is an array of strings
              if (!Array.isArray(list) || list.some(i => typeof i !== "string")) {
                throw new Error();
              }
              return list;
            } catch {
              return error(500, "failed to parse AI response");
            }

        }, {body: t.Object({image: t.Files()})})

        .post("/users", async ({body:{name, email, password}}) => {
            User.create({name, email, password});
        }, {body: t.Object({name: t.String(), email: t.String(), password: t.String()})})
        .get("/users", async ({body:{email, password}}) => {
        }, {body: t.Object({email: t.String(), password: t.String()})})

        .use(staticPlugin({assets: IMAGES_PATH, prefix: '/images'}))
  )

  //TODO
//   .get("/images/:filename", async ({params:{filename}}) => {
//     return Bun.read(`${IMAGES_PATH}/${filename}`);
//   })

  .use(staticPlugin({assets: WEBSITE_PATH, prefix: '/'}))

  .listen(8080);

console.log(
  `Server running on http://${app.server?.hostname}:${app.server?.port}`
);
