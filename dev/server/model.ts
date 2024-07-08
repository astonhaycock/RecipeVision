import { Schema, model, connect } from "mongoose";
import assert from "node:assert";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  email: string;
  password: string;
  ingredients: Array<string>;
}
interface IRecipe {
  name: string;
  description: string;
  time: string;
  ingredients: Array<string>;
  url: string;
}

// 2. Create a Schema corresponding to the document interface.
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  ingredients: { type: [String], required: true },
});
const RecipeSchema = new Schema<IRecipe>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: String, required: true },
  ingredients: { type: [String], required: true },
  url: { type: String, required: true },
});

// 3. Create a Model.
const User = model<IUser>("User", UserSchema);
const Recipe = model<IRecipe>("Recipe", RecipeSchema);

run().catch((err) => console.log(err));

async function run() {
  // 4. Connect to MongoDB
  let dbpass = process.env.DATABASE;
  assert.ok(dbpass, "DATABASE environment variable not found");
  await connect(dbpass);
  const user = new User({
    name: "Bill",
    email: "bill@initech.com",
    password: "123",
    ingredients: ["rice", "salt"],
  });
  await user.save();
}

UserSchema.methods.setPassword = async function (plainPassword: string) {
  try {
    let encryptedPassword = await Bun.password.hash(plainPassword);
    this.password = encryptedPassword;
  } catch (error) {
    console.log("Invalid password, can't set password");
  }
};

UserSchema.methods.verifyPassword = async function (plainPassword: string) {
  let isOkay = await Bun.password.verify(plainPassword, this.password);
  return isOkay;
};
export { User, Recipe };
