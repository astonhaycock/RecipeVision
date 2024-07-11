import { Schema, model, connect, Model } from "mongoose";
import assert from "node:assert";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  email: string;
  password: string;
  ingredients: Array<string>;
}
interface IRecipe {
  description: string;
  time: string;
  ingredients: Array<string>;
  url: string;
}

interface IUserMethods {
  verifyPassword(plainPassword: string): boolean;
  setPassword(plainPassword: string): void;
}

type UserModel = Model<IUser, {}, IUserMethods>;

// 2. Create a Schema corresponding to the document interface.
const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  ingredients: { type: [String], required: true },
});
const RecipeSchema = new Schema<IRecipe>({
  description: { type: String, required: true },
  time: { type: String, required: true },
  ingredients: { type: [String], required: true },
  url: { type: String, required: true },
});

UserSchema.method("setPassword", async function (plainPassword: string) {
  try {
    let encryptedPassword = await Bun.password.hash(plainPassword);
    console.log(this);
    this.password = encryptedPassword;
    console.log(this);
  } catch (error) {
    console.log("Invalid password, can't set password");
  }
});

UserSchema.method("verifyPassword", async function (plainPassword: string) {
  let isOkay = await Bun.password.verify(plainPassword, this.password);
  return isOkay;
});

// 3. Create a Model.
const User = model<IUser, UserModel>("User", UserSchema);
const Recipe = model<IRecipe>("Recipe", RecipeSchema);

// 4. Connect to MongoDB
let dbpass = process.env.DBPASSWORD;
assert.ok(dbpass, "DATABASE environment variable not found");
const DB = await connect(dbpass);

export { User, Recipe, DB };
