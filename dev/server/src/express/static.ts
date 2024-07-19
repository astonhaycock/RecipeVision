// This file sets up the file systems as needed for the website and images, and serves them.

import express from "express";
import type { Express, NextFunction, Request, Response } from "express";
import { mkdir } from "fs/promises";
import { IMAGES_PATH, WEBSITE_PATH, VUE_DEV } from "../env";

const SITE_ROUTES = ["/", "/auth", "/home", "/food", "/recipe"];

async function init(app: Express) {
  mkdir(IMAGES_PATH, { recursive: true }).catch(console.error);
  app.use("/images", express.static(IMAGES_PATH));

  // if (VUE_DEV) {
  //   console.log("\x1b[34mRunning in Vue dev mode\x1b[0m");
  // const vite = await createServer({
  //   server: { middlewareMode: true },
  //   appType: "custom",
  // });

  // app.use(vite.middlewares);

  // app.use("*", async (req: Request, res: Response, next: NextFunction) => {
  //   const url = req.originalUrl;
  //   try {
  //     let template = fs.readFileSync(
  //       path.resolve(WEBSITE_PATH, "index.html"),
  //       "utf-8"
  //     );
  //     template = await vite.transformIndexHtml(url, template);
  //     const { render } = await vite.ssrLoadModule("/src/entry-server.js");
  //     const appHtml = await render(url);
  //     const html = template.replace(`<!--ssr-outlet-->`, appHtml);
  //     res.status(200).set({ "Content-Type": "text/html" }).end(html);
  //   } catch (e) {
  //     vite.ssrFixStacktrace(e as Error);
  //     next(e);
  //   }
  // });
  //   SITE_ROUTES.map((route) => {
  //     app.use(route, proxy("http://localhost:8000"));
  //   });
  // } else {
  SITE_ROUTES.map((route) => {
    app.use(route, express.static(WEBSITE_PATH));
  });
  // }
}

export { init };
