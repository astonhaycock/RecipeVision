/// The directory path of the compiled website
const WEBSITE_PATH = "../client";
/// The directory path of the images temp folder
const IMAGES_PATH = "../images";
/// The port to run the server on
const PORT = 8080;

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
            const url = "http://144.38.193.103:8080/images/"+filename;
            console.log(url);
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [
                    {
                        role: "user",
                        content: [
                            {type: "text", text: "What cooking ingredients are in this image?"},
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

  .use(staticPlugin({assets: IMAGES_PATH, prefix: '/images'}))
  .use(staticPlugin({assets: WEBSITE_PATH, prefix: '/'}))

  .listen(PORT);

console.log(
  `Server running on http://${app.server?.hostname}:${app.server?.port}`
);
