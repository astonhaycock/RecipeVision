// This file is the implementation of the registration and login endpoints.
// The endpoints are written as async functions. The routes and middleware are
// specified in the `init` function at the bottom, which is called from `server.ts`

import type { Express, Request, Response } from "express";
import { Users } from "../../model";
import { authenticate_mw } from "../middleware";

//================================================================================================//
//==| Session Endpoints |=========================================================================//
//================================================================================================//

async function post_api_session(req: Request, res: Response): Promise<void> {
  if (!req.session) {
    // This is an internal server error, because the session middleware should always be present.
    res.status(500).send();
    return;
  }
  if (
    req.body === undefined ||
    req.body.email === undefined ||
    req.body.password === undefined
  ) {
    res.status(400).send("register with email and password as a json object");
    return;
  }
  if (
    typeof req.body.email !== "string" ||
    typeof req.body.password !== "string"
  ) {
    res.status(400).send("email and password must be strings");
  }
  req.body.email = req.body.email.toLowerCase();

  // Get the user from the database to compare the password
  let user = await Users.findOneAndPopulate({ email: req.body.email });
  if (!user) {
    res.status(401).send("incorrect email or password");
    return;
  }
  if (!(await user.verifyPassword(req.body.password))) {
    // identical error message for security reasons
    res.status(401).send("incorrect email or password");
    return;
  }
  // Set the user ID in the session
  req.session.user_id = user._id;
  req.user = user;
  res.status(201).send("logged in");
}

async function get_api_session(req: Request, res: Response): Promise<void> {
  res.status(200).send("logged in");
}

async function delete_api_session(req: Request, res: Response): Promise<void> {
  // Clear the user ID from the session
  req.session.user_id = undefined;
  req.user = null;
  res.status(204).send("logged out");
}

//================================================================================================//
//==| Registration Endpoints |====================================================================//
//================================================================================================//

async function post_api_user(req: Request, res: Response): Promise<void> {
  if (
    req.body === undefined ||
    req.body.email === undefined ||
    req.body.password === undefined
  ) {
    res.status(400).send("register with email and password as a json object");
    return;
  }
  if (
    typeof req.body.email !== "string" ||
    typeof req.body.password !== "string"
  ) {
    res.status(400).send("email and password must be strings");
  }
  req.body.email = req.body.email.toLowerCase();

  const result = await Users.newUser(req.body);
  if (!result) {
    res.status(500).send("internal server error");
    return;
  }
  if (typeof result === "string") {
    res.status(400).send(result);
    return;
  }
  res.status(201).send("registered");
}

//================================================================================================//
//==| Export |====================================================================================//
//================================================================================================//

function init(app: Express) {
  app.post("/api/session", post_api_session);
  app.post("/api/user", post_api_user);

  // These routes require authentication middleware
  app.get("/api/session", authenticate_mw, get_api_session);
  app.delete("/api/session", authenticate_mw, delete_api_session);
}

export { init };
