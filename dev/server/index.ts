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
import { staticPlugin } from "@elysiajs/static"
// Node.js fs module for creating directories
import { mkdir } from "node:fs/promises";
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
            // Save the file
            Bun.write(`${IMAGES_PATH}/${filename}`, image[0]);
            const url = `${Bun.env.PUBLIC_URL}/images/${filename}`;
            console.log(url);
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [
                    {
                        role: "user",
                        content: [
                            {type: "text", text: "Give me a list of cooking ingredients in this image, if any, as a JSON array of strings. If no ingredients are present, return an empty JSON array. Return only the JSON array, with no description, context, or formatting."},
                            {type: "image_url", image_url: {url: url, detail: "low"}}
                        ]
                    }
                ]
            });
            console.log(response);
            return response;
        }, {body: t.Object({image: t.Files()})})

        .post("/users", async ({body:{name, email, password}}) => {
            User.create({name, email, password});
        }, {body: t.Object({name: t.String(), email: t.String(), password: t.String()})})
        .get("/users", async ({body:{email, password}}) => {
        }, {body: t.Object({email: t.String(), password: t.String()})})
  )

  //TODO
//   .get("/images/:filename", async ({params:{filename}}) => {
//     return Bun.read(`${IMAGES_PATH}/${filename}`);
//   })

  .use(staticPlugin({assets: IMAGES_PATH, prefix: '/images'}))
  .use(staticPlugin({assets: WEBSITE_PATH, prefix: '/'}))

  .listen(8080);

console.log(
  `Server running on http://${app.server?.hostname}:${app.server?.port}`
);
