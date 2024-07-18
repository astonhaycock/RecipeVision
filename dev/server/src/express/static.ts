// This file sets up the file systems as needed for the website and images, and serves them.

import express from "express";
import type { Express } from "express";
import { mkdir } from "fs/promises";
import { IMAGES_PATH, WEBSITE_PATH, VUE_DEV } from "../env";
import proxy from "express-http-proxy";

const SITE_ROUTES = ["/", "/auth", "/home", "/food", "/recipe"];

function init(app: Express) {
  mkdir(IMAGES_PATH, { recursive: true })
    .catch(console.error)
    .then(() => {
      if (VUE_DEV) {
        console.warn(
          "Running in Vue dev mode: web requests are forwarded to the Vue dev server"
        );
        SITE_ROUTES.map((route) => {
          app.use(route, proxy("localhost:3840"));
        });
      } else {
        SITE_ROUTES.map((route) => {
          app.use(route, express.static(WEBSITE_PATH));
        });
        app.use("/images", express.static(IMAGES_PATH));
      }
    });
}

export { init };
