// This file sets up the file systems as needed for the website and images, and serves them.

import express from "express";
import type { Express, NextFunction, Request, Response } from "express";
import { mkdir } from "fs/promises";
import { IMAGES_PATH, WEBSITE_PATH } from "../env";

const SITE_ROUTES = ["/", "/auth", "/home", "/food", "/recipe"];

async function init(app: Express) {
  mkdir(IMAGES_PATH, { recursive: true }).catch(console.error);
  app.use("/images", express.static(IMAGES_PATH));

  SITE_ROUTES.map((route) => {
    app.use(route, express.static(WEBSITE_PATH));
  });
}

export { init };
