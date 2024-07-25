import type { Express, Request, Response } from "express";
import { PUBLIC_URL, RESEND_KEY } from "../../env";
import { Resend } from "resend";
import { authenticate_mw } from "../middleware";

const resend = new Resend(RESEND_KEY);

async function post_api_email(req: Request, res: Response): Promise<void> {
  if (req.body === undefined) {
    res.status(400).send("no body");
    return;
  }
  if (req.body.name === undefined || typeof req.body.name === "string") {
    res.status(400).send("no name");
    return;
  }
  if (req.body.email === undefined || typeof req.body.email === "string") {
    res.status(400).send("no email");
    return;
  }
  if (req.body.phone === undefined || typeof req.body.phone === "string") {
    res.status(400).send("no phone");
    return;
  }
  if (req.body.message === undefined || typeof req.body.message === "string") {
    res.status(400).send("no message");
    return;
  }
  if (req.body.message.length === 0) {
    res.status(400).send("empty message");
    return;
  }
  if (req.body.phone.length === 0 || req.body.email.length === 0) {
    res.status(400).send("no contact info provided");
    return;
  }
  const { data, error } = await resend.emails.send({
    from: `Contact Form <noreply@${PUBLIC_URL.replace(/https?:\/\//, "")}>`,
    to: ["whitingjarod@protonmail.com"],
    subject: "Recipe Vision Contact Form",
    text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nPhone: ${req.body.phone}\nMessage: ${req.body.message}`,
  });
  if (error) {
    res.status(500).send("error sending email");
    return;
  }
  res.status(200).send("email sent");
}

async function init(app: Express) {
  app.post("/api/email", authenticate_mw, post_api_email);
}

export { init };
