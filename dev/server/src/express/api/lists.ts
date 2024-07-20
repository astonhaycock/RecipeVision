// This file handles the routes for all user-created lists of strings.
// Currently, the lists are ingredients, recipe exclusions, and ingredient exclusions.

import type { Express, Request, Response } from "express";
import { authenticate_mw, list_mw } from "../middleware";
import { string_valid } from "../../utils";

const mw_inst = list_mw("items");

function list_routes(app: Express, list_name: string) {
  const path_name = list_name.replace(/_/g, "-");
  const plural_name = `${list_name}s`;
  const path_plural_name = `${path_name}s`;

  // Create a new item in the list
  app.post(`/api/${path_name}/:item`, authenticate_mw, async (req: Request, res: Response) => {
    if (!string_valid(req.params.item)) {
      res.status(400).send("invalid item");
      return;
    }
    const user = req.user;
    user[plural_name].list.push(req.params.item);
    user[plural_name].save();
    res.status(201).send(`item added to ${plural_name}`);
  });

  // Rename an item in the list
  app.put(
    `/api/${path_name}/:item/:new_item`,
    authenticate_mw,
    async (req: Request, res: Response) => {
      if (!string_valid(req.params.item)) {
        res.status(400).send("invalid item");
        return;
      }
      if (!string_valid(req.params.new_item)) {
        res.status(400).send("invalid new item");
        return;
      }
      const user = req.user;
      const list = user[plural_name].list;
      const index = list.indexOf(req.params.item);
      if (index === -1) {
        res.status(404).send("item not found");
        return;
      }
      list[index] = req.params.new_item;
      user[plural_name].save();
      res.status(204).send(`item renamed in ${plural_name}`);
    }
  );

  // Delete an item from the list
  app.delete(`/api/${path_name}/:item`, authenticate_mw, async (req: Request, res: Response) => {
    if (!string_valid(req.params.item)) {
      res.status(400).send("invalid item");
      return;
    }
    const user = req.user;
    const list = user[plural_name].list;
    const index = list.indexOf(req.params.item);
    if (index === -1) {
      res.status(404).send("item not found");
      return;
    }
    list.splice(index, 1);
    user[plural_name].save();
    res.status(204).send(`${plural_name} updated`);
  });

  // Get the list
  app.get(`/api/${path_plural_name}`, authenticate_mw, async (req: Request, res: Response) => {
    const user = req.user;
    res.status(200).send(user[plural_name].list);
  });

  // Concat a list from the user to the list
  app.put(
    `/api/${path_plural_name}`,
    authenticate_mw,
    mw_inst,
    async (req: Request, res: Response) => {
      const user = req.user;
      user[plural_name].list.push(...req.body.items);
      user[plural_name].save();
      res.status(204).send(`${plural_name} updated`);
    }
  );

  // Delete multiple items from the list
  app.delete(
    `/api/${path_plural_name}`,
    authenticate_mw,
    mw_inst,
    async (req: Request, res: Response) => {
      const user = req.user;
      const list = user[plural_name].list;
      console.log(req.body.items);
      for (const item of req.body.items) {
        const index = list.indexOf(item);
        if (index !== -1) {
          list.splice(index, 1);
        }
      }
      user[plural_name].save();
      res.status(204).send(`${plural_name} updated`);
    }
  );
}

//==| Export |====================================================================================//

function init(app: Express) {
  list_routes(app, "ingredient");
  list_routes(app, "recipe_exclusion");
  list_routes(app, "ingredient_exclusion");
  list_routes(app, "dietary_preference");
}

export { init };
