/// The directory path of the compiled website
const WEBSITE_PATH = "../client";
/// The directory path of the images temp folder
const IMAGES_PATH = "../images";

// Import the necessary modules
// Elysia for HTTP routing
import { Cookie, Elysia, error, t } from "elysia";
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
import { User, Recipe, DB } from "./model";
// Session handling community code
import { MongooseStore } from "./session";
import { sessionPlugin } from "elysia-session";
import { CookieStore } from "elysia-session/stores/cookie";

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
function dedup<T>(list: Array<T>, fn?: (a: T, b: T)=>number) {
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

type SessionCookie = {user_id?: string, user_email?: string};

// Create the Elysia app instance.
// Uses method chaining to add routes, settings, and plugins
const app = new Elysia()
  .use(cors())
  .use(sessionPlugin({
    store: new CookieStore({cookieOptions: {}}), //new MongooseStore(DB, "session"),
    expireAfter: 60*60*24*7
  }))
  // The `group` method allows for grouping routes under a common prefix
  // In this case, all routes under `/api` will be grouped together.
  // Inside the callback, we use the same method chaining format to add routes.
  .group('/api', app =>
    // The inner variable `app` is an Elysia instance containing the path,
    // but with `/api` removed.

      app
        .post("/session", async({body:{email, password}, cookie:{session}, set}) => {
          const user = await User.findOne({email: email});
          if (!user) {
            return error(401, "unauthorized");
          }
          if (!user.verifyPassword(password)) {
            return error(401, "unauthorized");
          }
          session.value = {user_id: user._id, user_email: email};
          // return the session cookie and 201 status
          set.status = 201;
          return session.value;
        }, {body: t.Object({email: t.String(), password: t.String()})})

        .post("/user", async({body:{email, password}, set}) => {
          const user = await User.findOne({email: email});
          if (user) {
            return error(409, "email in use");
          }
          const newUser = new User({email: email});
          await newUser.setPassword(password);
          const e = await newUser.validateSync();
          if (e) {
            console.error(e);
            return error(500, "failed to create user");
          }
          await newUser.save();

          set.status = 201;
          return "success";
        }, {body: t.Object({email: t.String(), password: t.String()})})

        .onBeforeHandle(async ({cookie: {session}}) => {
          if (!session) {
            console.log("no session");
            return error(401, "unauthorized");
          }
          console.log(session);
          const sess = session.value as SessionCookie;
          if (!sess.user_id || !sess.user_email) {
            console.log("no user_id or session_id");
            return error(401, "unauthorized");
          }
          const user = await User.findOne({_id: sess.user_id})
          if (!user) {
            console.log("no user");
            return error(401, "unauthorized");
          }
        })

        .post("/image", async ({body:{image}, cookie:{session}}) => {
            console.log(`Connection from ${session.value.user_email.toString()}`);

            // Hash the image and get the extension
            const hash = Bun.hash(await image.arrayBuffer())
            const ext = image.type.substring(6);
            // Combine them into a filename
            const filename = `${hash.toString(16).padStart(16, "0")}.${ext}`;
            // Check if the file already exists, delete it if it's too old
            let file = Bun.file(`${IMAGES_PATH}/${filename}`);
            if (await file.exists()) {
              if (Date.now() - (file.lastModified) > 60_000) {
                unlink(`${IMAGES_PATH}/${filename}`)
              }
              return error(400, "file already processing - be patient");
            }
            // Save the file
            Bun.write(`${IMAGES_PATH}/${filename}`, image);
            const url = `${Bun.env.PUBLIC_URL}/images/${filename}`;
            console.log(url);

            //TODO BUT IN ORANGE YAYA
            return "function stopped before using OpenAI call";

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
              dedup(list);
              return list;
            } catch {
              return error(500, "failed to parse AI response");
            }

        }, {body: t.Object({image: t.File({type: "image"})}), cookie: t.Cookie({session: t.Object({user_email: t.String(), user_id: t.String()})})})

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
