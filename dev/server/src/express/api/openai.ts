// This file is the implementation of the OpenAI API calls, and the endpoints to trigger them.
// The endpoints are written as async functions. The routes and middleware are
// specified in the `init` function at the bottom, which is called from `server.ts`

import { OpenAI } from "openai";
import {
  //TODO: This currently isn't used.
  GENERATE_RECIPE_IMAGE_PROMPT,
  GENERATE_RECIPE_PROMPT,
  GENERATED_IMAGES_PATH,
  IMAGE_PROMPT,
  OPENAI_KEY,
  PUBLIC_URL,
  RATE_LIMIT,
  RECIPE_PROMPT,
} from "../../env";
import type { Express, Request, Response } from "express";
import { RecipeExclusionsLists, AiRecipes, type User } from "../../model";
import { unlink } from "fs-extra";
import { parse_ai_response } from "../../utils";
import { authenticate_mw, image_mw, ratelimit_mw } from "../middleware";
import { get } from "https"; // or 'http' depending on the URL protocol
import { createWriteStream } from "fs";

// Create the OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_KEY });

//================================================================================================//

async function post_api_image(req: Request, res: Response): Promise<void> {
  const user = req.user as User;

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
  const result = parse_ai_response(response.choices[0].message.content as string);
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
            text: `ingredient_exclusions: ${JSON.stringify(user.recipe_exclusions.list)}`,
          },
          {
            type: "text",
            text: `recipe_exclusions: ${JSON.stringify(user.recipe_exclusions.list)}`,
          },
        ],
      },
    ],
  });

  console.log(response.choices[0].message.content);
  const result = parse_ai_response(response.choices[0].message.content as string);
  if (!result) {
    res.status(500).send("AI response failed to parse");
    return;
  }
  res.status(200).send(result);
}

//================================================================================================//

function downloadImage(url: string, filepath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(createWriteStream(filepath))
          .on("error", reject)
          .once("close", () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on("error", reject);
  });
}

async function get_api_recipe_generate(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  const ingredients = user.ingredients.list;

  if (ingredients.length < 10) {
    res.status(400).send("Not enough ingredients provided");
    return;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: GENERATE_RECIPE_PROMPT,
          },
          {
            type: "text",
            text: `ingredients: ${JSON.stringify(ingredients)}`,
          },
          {
            type: "text",
            text: `ingredient_exclusions: ${JSON.stringify(user.recipe_exclusions.list)}`,
          },
          {
            type: "text",
            text: `recipe_exclusions: ${JSON.stringify(user.recipe_exclusions.list)}`,
          },
        ],
      },
    ],
  });

  const content = response.choices[0].message.content as string;
  console.log("API Response Content:", content);

  let recipe = null;
  let image_name = null;

  try {
    const result = JSON.parse(content);
    if (!result) {
      throw new Error();
    }
    if (result.length === 0 || result.length > 1) {
      throw new Error();
    }
    const data = result[0];
    if (
      !data.title ||
      !data.description ||
      !data.cook_time ||
      !data.required_ingredients ||
      !data.instructions
    ) {
      throw new Error();
    }
    if (!Array.isArray(data.required_ingredients)) {
      throw new Error();
    }
    if (!Array.isArray(data.instructions)) {
      throw new Error();
    }
    for (let i = 0; i < data.required_ingredients.length; i++) {
      if (typeof data.required_ingredients[i] !== "string") {
        throw new Error();
      }
    }
    for (let i = 0; i < data.instructions.length; i++) {
      if (typeof data.instructions[i] !== "string") {
        throw new Error();
      }
    }
    if (data.required_ingredients.length === 0) {
      throw new Error();
    }
    if (
      typeof data.title !== "string" ||
      typeof data.description !== "string" ||
      typeof data.cook_time !== "number"
    ) {
      throw new Error();
    }
    if (
      data.title.length === 0 ||
      data.description.length === 0 ||
      data.instructions.length === 0
    ) {
      throw new Error();
    }
    image_name = `${crypto.randomUUID()}.png`;
    const tags: string[] = [];
    recipe = new AiRecipes({
      title: data.title,
      description: data.description,
      cook_time: data.cook_time,
      ingredients: data.required_ingredients,
      instructions: data.instructions,
      tags: tags,
      image: image_name,
      creator: user._id,
      date: new Date(),
    });
  } catch {
    res.status(500).send("AI response failed to parse");
    return;
  }

  const val_err = await recipe.validateSync();
  if (val_err) {
    res.status(500).send("AI response failed to validate");
    console.error("Validation Error:", val_err);
    return;
  }
  await recipe.save();

  // Send response
  res.status(200).send(recipe);

  // Generate image
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Generate an image for a recipe named "${recipe.title}" with the description "${recipe.description}"`,
    n: 1,
    // size: "512x512",
    size: "1024x1024",
  });
  const image_url = image.data[0].url as string;
  await downloadImage(image_url, GENERATED_IMAGES_PATH + "/" + image_name)
    .then(console.log)
    .catch(console.error);

  // Clean the content to ensure it is valid JSON
  // const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  // if (!jsonMatch) {
  // console.error("No valid JSON found in the response");
  // res.status(500).send("AI response failed to parse");
  // return;
  // }

  // const cleanedContent = jsonMatch[1].trim();
  // cleanedContent.replace(/\/\/ Optional for garnish/g, "");

  //   let result;
  //   try {
  //     result = JSON.parse(cleanedContent);
  //   } catch (jsonError) {
  //     console.error("Error parsing JSON:", jsonError);
  //     res.status(500).send("AI response failed to parse");
  //     return;
  //   }

  //   if (!result) {
  //     res.status(500).send("AI response failed to parse");
  //     return;
  //   }
  //   const image = await openai.images.generate({
  //     model: "dall-e-2",
  //     prompt:
  //       "generate an image for this recipe" +
  //       result.recipe_name +
  //       result.description,
  //     n: 1,
  //     size: "512x512",
  //   });
  //   const image_url = image.data[0].url as string;
  //   downloadImage(
  //     image_url,
  //     GENERATED_IMAGES_PATH + "/" + image_url.split("/").pop() + ".png"
  //   )
  //     .then(console.log)
  //     .catch(console.error);
  //   res.status(200).send(cleanedContent + "\n" + image_url);
  // } catch (error) {
  //   console.error("Error fetching recipe details:", error);
  //   res.status(500).send("Error fetching recipe details");
  // }
}

//================================================================================================//
//==| Export |====================================================================================//
//================================================================================================//

function init(app: Express) {
  app.post(
    "/api/image",
    authenticate_mw,
    image_mw.single("image"),
    ratelimit_mw("post_image", RATE_LIMIT),
    post_api_image
  );
  app.get(
    "/api/recipes",
    authenticate_mw,
    ratelimit_mw("get_recipes", RATE_LIMIT),
    get_api_recipes
  );
  app.get(
    "/api/recipe/generate",
    authenticate_mw,
    ratelimit_mw("generate_recipe", RATE_LIMIT),
    get_api_recipe_generate
  );
}

export { init };
