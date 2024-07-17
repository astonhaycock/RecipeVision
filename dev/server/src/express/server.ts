// This file sets up the Express server and initializes the middleware and the endpoints.
// The express server is not started here. It is exported to be started in `index.ts`.

import express from "express";

const app = express();

import { init as middleware } from "./middleware";
import { init as auth } from "./api/auth";
import { init as ingredients } from "./api/ingredients";
import { init as openai } from "./api/openai";

middleware(app);
auth(app);
ingredients(app);
openai(app);

export { app };
