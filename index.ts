import express from "express";
// import model from "./model";
// import cors from "cors";
// import { OpenAI } from openai;
// import multer from multer;

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public/recipe-vision-client"))



app.listen(8080,() => {
  console.log("running at http://localhost:8080")
})