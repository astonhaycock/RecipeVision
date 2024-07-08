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
            if (image.length !== 1) {
                return error(400, "Only one image is allowed");
            }
            if (image[0].type.substring(0, 6) !== "image/") {
                return error(400, "Only images are allowed");
            }
            console.log("AAAA");
            const hash = Bun.hash(await image[0].arrayBuffer())
            const ext = image[0].type.substring(6);
            const filename = `${hash.toString(16).padStart(16, "0")}.${ext}`;
            Bun.write(`${IMAGES_PATH}/${filename}`, image[0]);
            return image[0]
        }, {body: t.Object({image: t.Files()})})
  )

  .use(staticPlugin({assets: IMAGES_PATH, prefix: '/images'}))
  .use(staticPlugin({assets: WEBSITE_PATH, prefix: '/'}))

  .listen(PORT);

console.log(
  `Server running on http://${app.server?.hostname}:${app.server?.port}`
);
