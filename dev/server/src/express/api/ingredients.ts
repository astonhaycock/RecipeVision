// This file is the implementation of the ingredient list endpoints.
// The endpoints are written as async functions. The routes and middleware are
// specified in the `init` function at the bottom, which is called from `server.ts`

import type { Express, Request, Response } from "express";
import { authenticate_mw } from "../middleware";
import type { User } from "../../model";
import { dedup, sanitize_list, sanitize_string } from "../../utils";

async function put_api_ingredients(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  const result = sanitize_list(req.body.ingredients);
  if (!result) {
    res.status(400).send("invalid ingredients list");
    return;
  }
  const ingredients = result as string[];
  user.ingredients.list.concat(ingredients);
  dedup(user.ingredients.list);
  await user.ingredients.save();
  res.status(204).send("ingredients updated");
}

async function get_api_ingredients(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  res.status(200).send(user.ingredients.list);
}

async function post_api_ingredient(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  const ingredient = sanitize_string(req.params.ingredient);
  if (!ingredient) {
    res.status(400).send("invalid ingredient");
  }
  user.ingredients.list.push(ingredient as string);
  dedup(user.ingredients.list);
  await user.ingredients.save();
  res.status(201).send(ingredient);
}

async function put_api_ingredient(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  const ingredient = sanitize_string(req.params.ingredient);
  if (!ingredient) {
    res.status(400).send("invalid ingredient");
  }
  const new_ingredient = sanitize_string(req.params.new_ingredient);
  if (!new_ingredient) {
    res.status(400).send("invalid new ingredient");
  }
  for (let i = 0; i < user.ingredients.list.length; i++) {
    if (user.ingredients.list[i] === ingredient) {
      user.ingredients.list[i] = new_ingredient as string;
      dedup(user.ingredients.list);
      await user.ingredients.save();
      res.status(204).send("ingredient updated");
      return;
    }
  }
  // not found
  res.status(404).send("ingredient not found");
}

async function delete_api_ingredient(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const ingredient = sanitize_string(req.params.ingredient);
  if (!ingredient) {
    res.status(400).send("invalid ingredient");
  }
  for (let i = 0; i < user.ingredients.list.length; i++) {
    if (user.ingredients.list[i] === ingredient) {
      user.ingredients.list[i] =
        user.ingredients.list[user.ingredients.list.length - 1];
      user.ingredients.list.pop();
      await user.ingredients.save();
      res.status(204).send("ingredient deleted");
      return;
    }
  }
  // not found
  res.status(404).send("ingredient not found");
}

//================================================================================================//
//==| Export |====================================================================================//
//================================================================================================//

function init(app: Express) {
  app.put("/api/ingredients", authenticate_mw, put_api_ingredients);
  app.get("/api/ingredients", authenticate_mw, get_api_ingredients);

  app.post("/api/ingredient/:ingredient", authenticate_mw, post_api_ingredient);
  app.put(
    "/api/ingredient/:ingredient/:new_ingredient",
    authenticate_mw,
    put_api_ingredient
  );
  app.delete(
    "/api/ingredient/:ingredient",
    authenticate_mw,
    delete_api_ingredient
  );
}

export { init };
