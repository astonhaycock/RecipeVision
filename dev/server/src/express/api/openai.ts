// This file is the implementation of the OpenAI API calls, and the endpoints to trigger them.
// The endpoints are written as async functions. The routes and middleware are
// specified in the `init` function at the bottom, which is called from `server.ts`

import { OpenAI } from "openai";
import {
  IMAGE_PROMPT,
  OPENAI_KEY,
  PUBLIC_URL,
  RATE_LIMIT,
  RECIPE_PROMPT,
} from "../../env";
import type { Express, Request, Response } from "express";
import type { User } from "../../model";
import { unlink } from "fs-extra";
import { parse_ai_response } from "../../utils";
import { authenticate_mw, image_mw } from "../middleware";

// Create the OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_KEY });

//================================================================================================//

async function post_api_image(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  // check rate limit
  if (user.last_request > new Date(Date.now() - RATE_LIMIT)) {
    res.status(429).send("rate limited");
    return;
  }
  user.last_request = new Date(Date.now());

  if (req.file === undefined) {
    res.status(400).send("no image uploaded");
    return;
  }
  let file = req.file as Express.Multer.File;
  // asynchronously delete the file after 15 seconds.
  setTimeout(() => unlink(file.path).catch(console.error), 15_000);
  // Create the URL that OpenAI will download the image from.
  let url = `${PUBLIC_URL}/images/${file.filename}`;
  console.log(`image uploaded: ${url}`);

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
  console.log(response.choices[0].message.content);
  const result = parse_ai_response(
    response.choices[0].message.content as string
  );
  if (!result) {
    res.status(500).send("AI response failed to parse");
    return;
  }
  res.status(200).send(result);
}

//================================================================================================//

async function get_api_recipes(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  const ingredients = user.ingredients.list;
  if (ingredients.length === 0) {
    res.status(400).send("no ingredients provided");
    return;
  }

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
            text: `ingredients: ${JSON.stringify(ingredients)}`,
          },
          {
            type: "text",
            text: `ingredient_exclusions: ${JSON.stringify(
              user.recipe_exclusions.list
            )}`,
          },
          {
            type: "text",
            text: `recipe_exclusions: ${JSON.stringify(
              user.recipe_exclusions.list
            )}`,
          },
        ],
      },
    ],
  });

  console.log(response.choices[0].message.content);
  const result = parse_ai_response(
    response.choices[0].message.content as string
  );
  if (!result) {
    res.status(500).send("AI response failed to parse");
    return;
  }
  res.status(200).send(result);
}

//================================================================================================//
//==| Export |====================================================================================//
//================================================================================================//

function init(app: Express) {
  app.post(
    "/api/image",
    authenticate_mw,
    image_mw.single("image"),
    post_api_image
  );
  app.get("/api/recipes", authenticate_mw, get_api_recipes);
}

export { init };
