import type { Express } from "express";
const { Readable } = require("stream");

async function init(app: Express) {
  app.get("/api/allrecipes/:query", async (req, res) => {
    const query = req.params.query;
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const response = await fetch(
      `https://www.allrecipes.com/search/?q=${query.replace(/ /g, "+")}`,
      { headers }
    );
    Readable.fromWeb(response.body).pipe(res);
  });
}
