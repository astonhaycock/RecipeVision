import type { Request, Response, Express } from "express";
import { authenticate_mw, ratelimit_mw } from "../middleware";
import { AiRecipes, type User } from "../../model";
import { purint } from "../../utils";

async function get_api_ai_recipes(req: Request, res: Response): Promise<void> {
  const user = req.user as User;
  const query = await AiRecipes.find({ creator: user._id })
    .sort({ date: -1 })
    .limit(20);
  if (query.length === 0) {
    res.status(404).json({ message: "No recipes found" });
    return;
  }
  purint(`${query}`);
  res.status(200).json(query);
}

function init(app: Express) {
  app.get(
    "/api/ai/recipes",
    authenticate_mw,
    ratelimit_mw(3_000),
    get_api_ai_recipes
  );
}

export { init };
