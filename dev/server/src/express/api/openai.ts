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
import { sanitize_list } from "../../utils";
import { authenticate_mw, image_mw } from "../middleware";

// Create the OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_KEY });

//================================================================================================//

async function get_api_image(req: Request, res: Response): Promise<void> {
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
  try {
    // Try to parse the response as a json.
    // We're in a try/catch block, and we're okay (happy, actually) with getting a type error
    // in this position.
    // All errors in here are irrecoverable and necessetate a retry.
    // We'll also convert the list to lowercase for consistency.
    // On the frontend, we can handle capitalization with CSS.
    const list = await JSON.parse(
      response.choices[0].message.content as string
    );
    if (!Array.isArray(list) || list.some((i) => typeof i !== "string")) {
      throw new Error();
    }
    // Success! Sanitize the list before sending it to the client.
    const result = sanitize_list(list);
    if (!result) {
      throw new Error();
    }
    res.status(200).send(result as string[]);
  } catch {
    // All errors here are generic and irrecoverable. They all result from the AI response
    // being malformed. There is no need to differentiate between them, because the client
    // can't do anything about it anyways.
    res.status(500).send("AI response failed to parse");
  }
}

//================================================================================================//

async function get_api_recipes(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  //TODO: We shouldn't need to sanitize in this position, since it comes from an internal database.
  const ingredients = sanitize_list(user.ingredients.list) || [];
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
            text: JSON.stringify(ingredients),
          },
        ],
      },
    ],
  });

  console.log(response.choices[0].message.content);

  try {
    const list = await JSON.parse(
      response.choices[0].message.content as string
    );
    if (!Array.isArray(list) || list.some((i) => typeof i !== "string")) {
      throw new Error();
    }
    const result = sanitize_list(list);
    if (!result) {
      throw new Error();
    }
    res.status(200).send(result as string[]);
  } catch {
    res.status(500).send("AI response failed to parse");
  }
}

//================================================================================================//
//==| Export |====================================================================================//
//================================================================================================//

function init(app: Express) {
  app.get(
    "/api/image",
    authenticate_mw,
    image_mw.single("image"),
    get_api_image
  );
  app.get("/api/recipes", authenticate_mw, get_api_recipes);
}

export { init };
