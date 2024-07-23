import type { Express, Request, Response } from "express";
import { mkdir } from "fs/promises";
import { watch } from "fs";
import { GENERATED_IMAGES_PATH } from "../env";
import { authenticate_mw } from "./middleware";
import { $ } from "bun";
import { purint } from "../utils";

const queue: { [key: string]: () => void } = {};

// sendFile expects a fully qualified path, so we get the current working directory.
// After two hours of debugging, I remembered this has a trailing newline.
const pwd = (await $`pwd`).text().trim();

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
  purint(`GET /api/ai/image/${req.params.name}`);

  // const path = `${GENERATED_IMAGES_PATH}/${image_name}`;
  const path = `${pwd}/${GENERATED_IMAGES_PATH}/${image_name}`;
  purint(`Absolute path: ${path}`);
  const file = Bun.file(`${path}`);
  if (await file.exists()) {
    purint("File exists");
    res.status(200).sendFile(`${path}`);
    return;
  }
  purint("File doesn't exist.");
  let waiting = true;
  queue[image_name] = () => {
    purint(`Sending image ${path}`);
    waiting = false;
    res.status(200).sendFile(`${path}`);
  };
  setTimeout(() => {
    if (waiting) {
      purint("Image timed out");
      res.status(408).send("Image not found");
      delete queue[image_name];
    }
  }, 15_000);
}

function init(app: Express) {
  mkdir(GENERATED_IMAGES_PATH, { recursive: true }).catch(console.error);
  const watcher = watch(GENERATED_IMAGES_PATH, (_, filename) => {
    purint("Directory update");
    if (filename && queue[filename]) {
      purint("Waiting 1 second");
      setTimeout(queue[filename], 5000);
    }
  });
  process.on("SIGINT", () => {
    watcher.close();
    process.exit();
  });
  app.get("/api/ai/image/:name", authenticate_mw, get_api_ai_image);
}

export { init };
