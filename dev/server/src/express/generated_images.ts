import type { Express, Request, Response } from "express";
import { mkdir } from "fs/promises";
import { watch } from "fs";
import { GENERATED_IMAGES_PATH } from "../env";
import { authenticate_mw } from "./middleware";

const queue: { [key: string]: () => void } = {};

/**
 * This route will attempt to get an AI generated image.
 * It is expected that the image will not have finished generating, so this
 * function will wait for the image to be generated, or return a 408 if the
 * image is not ready within a time limit.
 * @param req
 * @param res
 */
async function get_api_ai_image(req: Request, res: Response): Promise<void> {
  const image_name = req.params.name;
  const path = `${GENERATED_IMAGES_PATH}/${image_name}`;
  const file = Bun.file(path);
  if (await file.exists()) {
    res.status(200).sendFile(path);
  }
  let waiting = true;
  queue[image_name] = () => {
    waiting = false;
    res.status(200).sendFile(path);
  };
  setTimeout(() => {
    if (waiting) {
      res.status(408).send("image not found");
      delete queue[image_name];
    }
  }, 15_000);
}

function init(app: Express) {
  mkdir(GENERATED_IMAGES_PATH, { recursive: true }).catch(console.error);
  const watcher = watch(GENERATED_IMAGES_PATH, (_, filename) => {
    if (filename && queue[filename]) {
      queue[filename]();
    }
  });
  process.on("SIGINT", () => {
    watcher.close();
  });
  app.get("/api/ai/image/:name", authenticate_mw, get_api_ai_image);
}

export { init };
