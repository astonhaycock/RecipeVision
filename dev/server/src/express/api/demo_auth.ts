// This file allows users to create demo accounts with base ingredients.
// This should be disabled in production

import type { Express, Request, Response } from "express";
import { Users } from "../../model";
import { DEMO_AUTH } from "../../env";

/**
 * Create a new demo user, tied to session days.
 * @param req
 * @param res
 * @returns
 */
async function post_api_demo_auth(req: Request, res: Response) {
  if (req.session === undefined) {
    res.status(500).send();
    return;
  }
  if (req.session.user_id !== undefined) {
    res.status(400).send("already logged in");
    return;
  }
  const newboyo = await Users.newDemoUser();
  if (newboyo === null) {
    res.status(500).send("error creating user");
    return;
  }
  const user = await newboyo.tryPopulateAll();
  if (user === null) {
    res.status(500).send("error populating user");
    return;
  }
  req.session.user_id = user._id;
  console.log(`successfully logged in as ${user.email}`);
}

function init(app: Express) {
  if (DEMO_AUTH) {
    app.post("/api/demo_auth", post_api_demo_auth);
  }
}
