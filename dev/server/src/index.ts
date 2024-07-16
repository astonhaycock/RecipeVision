//================================================================================================//
//==| IMPORTS |===================================================================================//
//================================================================================================//

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
// Multer for handling file uploads
import multer from "multer";

// Schemas and MongoDB models
import { Users, type User } from "./model";
import type { Document, Types } from "mongoose";

// Environment variables, specified and validated in env.ts
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
  COOKIE_EXPIRATION,
  IMAGE_PROMPT,
  RECIPE_PROMPT,
} from "./env";

//TODO: automate this.
/// Which paths need to be routed to the Vue website.
const SITE_ROUTES = [
  "/",
  "/login",
  "/logout",
  "/register",
  "/recipe",
  "/ingredients",
];

//================================================================================================//
//==| NAMESPACE MERGING |=========================================================================//
//================================================================================================//

// Namespace and interface merging is a Typescript trick to add properties to an existing type.
// It serves no purpose other than to make Typescript happy.

// Extend the Express session data to include the user ID and user object.
declare module "express-session" {
  interface SessionData {
    /// The user ID generated by Mongoose
    user_id: Types.ObjectId;
  }
}
// Extend the Express Request object to include the user object.
declare global {
  namespace Express {
    interface Request {
      /// The user object from the database
      user: User | null;
    }
  }
}

//================================================================================================//
//==| UTILITIES |=================================================================================//
//================================================================================================//

/// Sort a list and deduplicate items
/// Returns void, but modifies the list in place
/// @param list The list to deduplicate
/// @param fn An optional comparison function
function dedup<T>(list: Array<T>, fn?: (a: T, b: T) => number) {
  list.sort(fn);
  if (fn === undefined) {
    fn = (a, b) => (a == b ? 0 : 1);
  }
  for (let i = list.length - 1; i > 0; i--) {
    if (fn(list[i], list[i - 1]) === 0) {
      list[i] = list[list.length - 1];
      list.pop();
    }
  }
}

//================================================================================================//
//==| SETUP |=====================================================================================//
//================================================================================================//

// Create the Express app
const app = express();
// Create the OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_KEY });
// Create the images folder if it doesn't exist.
await mkdir(IMAGES_PATH, { recursive: true }).catch(console.error);

//================================================================================================//
//==| MIDDLEWARE |================================================================================//
//================================================================================================//

// Enable CORS for all requests
app.use(cors());
// Use body-parser to parse JSON request bodies
app.use(express.json());

// Create the Multer storage engine, specifying the destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // The destination is the images folder
    cb(null, IMAGES_PATH);
  },
  filename: (req, file, cb) => {
    // Generate a hash from the current date and time and the file name.
    // It's not perfect, but it's enough for temporary image names.
    // Proper hashing is a pain with Multer. It was much easier with Elysia.
    // I could also generate a UUID, but I'd need to import another module.
    // This is fast enough.

    // md5 hashing for its speed and simplicity
    let hasher = new Bun.CryptoHasher("md5");
    // Update the hash with the current time
    hasher.update(Date.now().toString());
    // Update the hash with the original file name
    hasher.update(file.originalname);
    // Finish computing the hash and convert it to hexadecimal
    let hash = hasher.digest("hex");
    // Split the MIME type and get the file extension
    let file_ext = file.mimetype.split("/")[1];
    // Combine the hash and the file extension as the image name
    cb(null, `${hash}.${file_ext}`);
  },
});

// Create the Multer upload handler with the storage engine
const upload = multer({
  // The storage object created above.
  storage: storage,
  // The file size limit specified in env.ts
  limits: { fileSize: FILE_LIMIT },
  // Ensure the file is a png or jpeg before saving it to the disk.
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
    // At this point, the file is an image, so we signal that it's okay to save it.
    cb(null, true);
  },
});

// Create the Express session handler with the MongoDB store, and add it to the app
app.use(
  session({
    secret: SESSION_SECRET,
    // Use MongoStore to store the session data in MongoDB
    store: MongoStore.create({ mongoUrl: MONGODB_URL }),
    cookie: { maxAge: COOKIE_EXPIRATION },
    resave: false,
    saveUninitialized: false,
  })
);

// Create the authentication middleware
/// Authenticate the user by checking the session, then checking the database to ensure the user
/// exists. If the user is not found, or the session is invalid, return a 401 Unauthorized status.
async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.session || !req.session.user_id) {
    res.status(401).send("unauthorized");
    return;
  }
  if (req.user === null) {
    console.log("user not found in session");
    res.status(500).send("internal server error");
    return;
  }
  // Get the user from the database
  const result = Users.findByIdAndPopulate(req.session.user_id);
  if (!result) {
    res.status(500).send("internal server error");
    return;
  }
  const user = await result;
  if (!user) {
    res.status(401).send("unauthorized");
    return;
  }
  // Add the user object to the session so other functions can access it later
  req.user = user as User;
  next();
}

//================================================================================================//
//==| STATIC FILES |==============================================================================//
//================================================================================================//

// Serve the website files to the client
SITE_ROUTES.map((route) => app.use(route, express.static(WEBSITE_PATH)));
// Serve the images to OpenAI
app.use("/images", express.static(IMAGES_PATH));

//================================================================================================//
//==| AUTHENTICATION & SESSION |==================================================================//
//================================================================================================//

// The login route
app.post("/api/session", async (req: Request, res: Response) => {
  if (!req.session) {
    // This is an internal server error, because the session middleware should always be present.
    res.status(500).send();
    return;
  }
  if (
    req.body === undefined ||
    // I
    req.body.email === undefined ||
    // really
    req.body.password === undefined ||
    // miss
    typeof req.body.email !== "string" ||
    // working
    typeof req.body.password !== "string" ||
    // in
    req.body.email.length === 0 ||
    // Rust.
    req.body.password.length === 0
  ) {
    res.status(400).send("log in with email and password as a json object");
    return;
  }
  // Get the user from the database to compare the password
  let user = await Users.findOneAndPopulate({ email: req.body.email });
  if (!user) {
    res.status(401).send("incorrect email or password");
    return;
  }
  if (!user.verifyPassword(req.body.password)) {
    // identical error message for security reasons
    res.status(401).send("incorrect email or password");
    return;
  }
  // Set the user ID in the session
  // Do we even really need a user id? probably not, since emails are guaranteed to be unique
  req.session.user_id = user._id;
  req.user = user;
  //TODO: return user info
  res.status(201).send("logged in");
});

// Get any session information, such as when loading the page
app.get("/api/session", authenticate, async (req: Request, res: Response) => {
  // By this point, we're already authenticated. All we need to do is return data.
  //TODO: return user info
  res.status(201).send("logged in");
});
// changes cookie info to null when logout
app.post("/api/logout", async (req: Request, res: Response) => {
  req.session.user_id = undefined;
  req.user = null;
  res.status(200).send("logged out");
});

// The route to register a new user
app.post("/api/user", async (req: Request, res: Response) => {
  if (
    //TODO: I need to universalize the sanity checks.
    //TODO: I bet Express has something for it.
    // Addendum: Mongoose is now validating emails
    req.body === undefined ||
    // I
    req.body.email === undefined ||
    // REALLY
    req.body.password === undefined ||
    // MISS
    typeof req.body.email !== "string" ||
    // WORKING
    typeof req.body.password !== "string" ||
    // IN
    req.body.email.length === 0 ||
    // RUST.
    req.body.password.length === 0
  ) {
    res.status(400).send("register with email and password as a json object");
    return;
  }
  // Create the new user.
  const result = await Users.newUser(req.body);
  if (!result) {
    res.status(500).send("internal server error");
    return;
  }
  if (typeof result === "string") {
    res.status(400).send(result);
    return;
  }
  res.status(201).send("user created");
});

//================================================================================================//
//==| IMAGE PROCESSING |==========================================================================//
//================================================================================================//

// The route to upload images and get a list of ingredients
// Should this be a GET instead? It doesn't matter.
app.post(
  "/api/image",
  authenticate,
  upload.single("image"),
  async (req: Request, res: Response) => {
    // This should be safe, because the authenticate middleware should have already run.
    const user = req.user as User;
    // Rate limit the requests using session data.
    if (
      // This is ugly as beans but it gets the job done for now.
      (user.last_request || new Date(Date.now() - RATE_LIMIT)) >
      new Date(Date.now() - RATE_LIMIT)
    ) {
      res.status(429).send("rate limited");
      return;
    } else {
      // Update the last request time
      user.last_request = new Date(Date.now());
    }
    // Ensure the file was properly uploaded.
    // Invalid files would have been caught by the Multer middleware, leaving this field undefined.
    if (req.file === undefined) {
      res.status(400).send("no image provided");
      return;
    }
    // The file is non-null, so we can recast it for the remainder of the function.
    let file = req.file as Express.Multer.File;
    // asynchronously delete the file after 15 seconds. The OpenAI request shouldn't take that long.
    setTimeout(() => {
      unlink(file.path).catch(console.error);
    }, 15_000);
    // The URL to the image is the public URL plus the file name.
    // This is not DRY, but it's fine for now.
    //TODO: make this route DRY
    let url = `${PUBLIC_URL}/images/${req.file.filename}`;
    console.log(`uploaded image: ${url}`);
    // Send the image to OpenAI for processing.
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: IMAGE_PROMPT,
            },
            {
              type: "image_url",
              image_url: { url: url, detail: "high" },
            },
          ],
        },
      ],
    });
    // Log the raw response for debugging purposes.
    console.log(response.choices[0].message.content);
    try {
      // Try to parse the response as a json.
      const list = await JSON.parse(
        // we're in a try/catch block, and we're okay (happy, actually) with getting a type error
        // in this position.
        // All errors in here are irrecoverable and necessetate a retry.
        // We'll also convert the list to lowercase for consistency.
        // On the frontend, we can handle capitalization with CSS.
        (response.choices[0].message.content as string).toLowerCase()
      );
      // Verify that the JSON parsed into what we expect.
      // It should be an array, and all entries should be strings.
      if (!Array.isArray(list) || list.some((i) => typeof i !== "string")) {
        // Otherwise, our state is irrecoverable and we can simply error out.
        throw new Error();
      }
      // Success! Sort and deduplicate the list before sending it to the client.
      //TODO: A library utility for this would be a little faster, though it doesn't make
      //TODO: a difference in this particular location.
      dedup(list);
      // Return the list.
      res.status(201).send(list);
    } catch {
      // All errors here are generic and irrecoverable. There is no need to differentiate
      // between them, because the client can't do anything about it.
      res.status(500).send("failed to parse AI response");
    }
  }
);

//================================================================================================//
//==| INGREDIENT LISTS |==========================================================================//
//================================================================================================//

// The route for receiving a list of new ingredients
app.put(
  "/api/ingredients",
  authenticate,
  async (req: Request, res: Response) => {
    if (
      req.body.ingredients === undefined ||
      !Array.isArray(req.body.ingredients)
    ) {
      res.status(400).send("ingredients must be an array of strings");
      return;
    }
    let ingredients = req.body.ingredients as Array<string>;
    for (let i = 0; i < ingredients.length; i++) {
      if (typeof ingredients[i] !== "string" || ingredients[i].length === 0) {
        res
          .status(400)
          .send("ingredients must be an array of non-empty strings");
        return;
      }
      ingredients[i] = ingredients[i].toLowerCase();
    }
    // Merge ingredients with req.user.ingredients
    let user = req.user as User;
    user.ingredients.list = user.ingredients.list.concat(ingredients);
    dedup(user.ingredients.list);
    user.ingredients.save();
    res.status(204).send("ingredients added");
  }
);

// The route for getting the user's ingredients
app.get(
  "/api/ingredients",
  authenticate,
  async (req: Request, res: Response) => {
    let user = req.user as User;
    res.status(200).send(user.ingredients.list);
  }
);

// The route for deleting a single ingredient
app.delete(
  "/api/ingredient/:ingredient",
  authenticate,
  async (req: Request, res: Response) => {
    let user = req.user as User;
    let ingredient = req.params.ingredient.toLowerCase();
    // iterate backwards and swap-remove
    for (let i = user.ingredients.list.length - 1; i >= 0; i--) {
      if (user.ingredients.list[i] === ingredient) {
        user.ingredients.list[i] =
          user.ingredients.list[user.ingredients.list.length - 1];
        user.ingredients.list.pop();
        user.ingredients.save();
        res.status(204).send();
        return;
      }
    }
    res.status(404).send("ingredient not found");
  }
);

// The route for renaming a single ingredient
app.put(
  "/api/ingredient/:ingredient/:new_ingredient",
  authenticate,
  async (req: Request, res: Response) => {
    let user = req.user as User;
    let ingredient = req.params.ingredient.toLowerCase();
    let new_ingredient = req.params.new_ingredient.toLowerCase();
    for (let i = 0; i < user.ingredients.list.length; i++) {
      if (user.ingredients.list[i] === ingredient) {
        user.ingredients.list[i] = new_ingredient;
        dedup(user.ingredients.list);
        user.ingredients.save();
        res.status(204).send();
        return;
      }
    }
    res.status(404).send("ingredient not found");
  }
);

// The route for creating a single ingredient
app.post(
  "/api/ingredient/:ingredient",
  authenticate,
  async (req: Request, res: Response) => {
    let user = req.user as User;
    let ingredient = req.params.ingredient.toLowerCase();
    if (ingredient.length === 0) {
      res.status(400).send("ingredient must be a non-empty string");
      return;
    }
    user.ingredients.list.push(ingredient);
    dedup(user.ingredients.list);
    user.ingredients.save();
    res.status(201).send(ingredient);
  }
);

//================================================================================================//
//==| RECIPE GENERATION |=========================================================================//
//================================================================================================//

// The route for generating a recipe for a user
app.get("/api/recipe", authenticate, async (req: Request, res: Response) => {
  let user = req.user as User;
  let ingredients = user.ingredients.list;
  if (ingredients.length === 0) {
    res.status(400).send("no ingredients provided");
    return;
  }
  for (let i = 0; i < ingredients.length; i++) {
    if (typeof ingredients[i] !== "string" || ingredients[i].length === 0) {
      res.status(400).send("ingredients must be an array of non-empty strings");
      return;
    }
    ingredients[i] = ingredients[i].toLowerCase();
  }
  // Send the ingredients to OpenAI for processing.
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: RECIPE_PROMPT,
          },
          {
            type: "text",
            text: JSON.stringify(ingredients),
          },
        ],
      },
    ],
  });
  console.log(response.choices[0].message.content);
  try {
    // Try to parse the response as a json.
    const list = await JSON.parse(
      (response.choices[0].message.content as string).toLowerCase()
    );
    // Verify that the JSON parsed into what we expect.
    if (!Array.isArray(list) || list.some((i) => typeof i !== "string")) {
      throw new Error();
    }
    dedup(list);
    res.status(200).send(list);
  } catch {
    res.status(500).send("failed to parse AI response");
  }
});

//================================================================================================//
//==| SERVER & POST-SETUP |=======================================================================//
//================================================================================================//

app.listen(PORT, () => {
  console.log(`Server started: http://127.0.0.1:${PORT}/`);
});

// AAAAAAAAAAAAAAAAA
// Let it all out! That was a lot of comments to write!
// But this file is done.
