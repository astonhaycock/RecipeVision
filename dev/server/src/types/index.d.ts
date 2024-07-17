// This file defines type overrides and interface merging for the Express and Mongoose libraries.

import express = require("express");
import { EventEmitter } from "events";
import type { User } from "../express/model";
import type { Types } from "mongoose";

declare module "express-session" {
  interface SessionData {
    user_id: Types.ObjectId;
  }
}

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}
