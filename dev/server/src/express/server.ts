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
