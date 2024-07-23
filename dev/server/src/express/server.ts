// This file sets up the Express server and initializes the middleware and the endpoints.
// The express server is not started here. It is exported to be started in `index.ts`.

import express from "express";

const app = express();

import { init as middleware } from "./middleware";
import { init as auth } from "./api/auth";
import { init as lists } from "./api/lists";
import { init as openai } from "./api/openai";
import { init as statics } from "./static";
import { init as allrecipes } from "./api/allrecipes";
import { init as generated_images } from "./generated_images";
import { init as demo_auth } from "./api/demo_auth";

await middleware(app);
await auth(app);
await lists(app);
await openai(app);
await statics(app);
await allrecipes(app);
await generated_images(app);
await demo_auth(app);

export { app };
