import type { Request, Response, Express } from "express";
import { authenticate_mw, no_auth_if_mw, ratelimit_mw } from "../middleware";
import { AiRecipes, type User } from "../../model";

async function get_api_ai_user_recipes(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as User;
  const query = await AiRecipes.find({ creator: user._id })
    .sort({ date: -1 })
    .skip(20 * (req.params.page ? parseInt(req.params.page) : 0))
    .limit(20);
  if (query.length === 0) {
    res.status(404).json({ message: "No recipes found" });
    return;
  }
  res.status(200).json(query);
}

async function get_api_ai_recipes(req: Request, res: Response): Promise<void> {
  const query = await AiRecipes.find()
    .sort({ date: -1 })
    .skip(20 * (req.params.page ? parseInt(req.params.page) : 0))
    .limit(20);
  if (query.length === 0) {
    res.status(404).json({ message: "No recipes found" });
    return;
  }
  res.status(200).json(query);
}

function init(app: Express) {
  app.get(
    "/api/ai/user-recipes/:page?",
    authenticate_mw,
    get_api_ai_user_recipes
  );
  app.get(
    "/api/ai/recipes/:page?",
    no_auth_if_mw((req) => {
      return req.params.page === undefined;
    }),
    get_api_ai_recipes
  );
}

export { init };
