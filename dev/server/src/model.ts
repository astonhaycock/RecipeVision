// This file defines the types and interfaces for the Mongoose models and schemas.
// Turn back if you value your sanity.
// Mongoose and TypeScript were not meant to be together.
// Oh, and this file also defines validation, hashing, and various convenience methods.

import {
  Schema,
  model,
  connect,
  Model,
  Types,
  type HydratedDocument,
} from "mongoose";
import { MONGODB_URL, RATE_LIMIT } from "./env";

const email_regex =
  /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//================================================================================================//
//==| LIST MODELS & SCHEMAS |=====================================================================//
//================================================================================================//

interface IList {
  _id: Types.ObjectId;
  list: Array<string>;
}
const ListSchema = new Schema({
  list: { type: [String], required: true },
});
const IngredientsLists = model<IList>("Ingredients_List", ListSchema);
const RecipeExclusionsLists = model<IList>(
  "Recipe_Exclusions_List",
  ListSchema
);
const IngredientExclusionsLists = model<IList>(
  "Ingredient_Exclusions_List",
  ListSchema
);
const DietaryPreferencesLists = model<IList>(
  "Dietary_Preferences_List",
  ListSchema
);

//================================================================================================//
//==| USER MODEL & SCHEMA |=======================================================================//
//================================================================================================//

interface IUser {
  email: string;
  password: string;
  last_request: Date;
  ingredients?: Types.ObjectId;
  recipe_exclusions?: Types.ObjectId;
  ingredient_exclusions?: Types.ObjectId;
  dietary_preferences?: Types.ObjectId;
}

interface IPopulatedUser {
  email: string;
  password: string;
  last_request: Date;
  ingredients: IngredientsList;
  recipe_exclusions: RecipeExclusionsList;
  ingredient_exclusions: IngredientExclusionsList;
  dietary_preferences: DietaryPreferencesList;
}

interface IUserMethods {
  verifyPassword(plainPassword: string): Promise<boolean>;
  setPassword(plainPassword: string): void;
  tryPopulateAll(): Promise<User | null>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  // Look ma, no async!
  // Side note, Copilot finished that little joke. I must be unoriginal.
  // Still, it's the first time I've ever returned a promise in my own code.
  // There is no particular reason to return a promise here, but it does add some versatility.
  /// Load a user from the database by their ID and populate the fields.
  /// @param id The ID of the user to load.
  findByIdAndPopulate(id: string | Types.ObjectId): Promise<User | null>;
  /// Load a user from the database by a query and populate the fields.
  /// @param query The query to search for the user.
  findOneAndPopulate(query: any): Promise<User | null>;
  /// Create a new user and all sub-fields.
  newUser(auth: {
    email: string;
    password: string;
  }): Promise<User | string | null>;
}

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: { type: String, required: true, match: email_regex },
  password: { type: String, required: true },
  last_request: { type: Date, required: true },
  ingredients: {
    type: Schema.Types.ObjectId,
    ref: "Ingredients_List",
    required: true,
  },
  recipe_exclusions: {
    type: Schema.Types.ObjectId,
    ref: "Recipe_Exclusions_List",
    required: true,
  },
  ingredient_exclusions: {
    type: Schema.Types.ObjectId,
    ref: "Ingredient_Exclusions_List",
    required: true,
  },
  dietary_preferences: {
    type: Schema.Types.ObjectId,
    ref: "Dietary_Preferences_List",
    required: true,
  },
});

UserSchema.method("setPassword", async function (plainPassword: string) {
  try {
    let encryptedPassword = await Bun.password.hash(plainPassword);
    this.password = encryptedPassword;
  } catch (error) {
    console.log("can't set password");
  }
});

UserSchema.method("verifyPassword", async function (plainPassword: string) {
  let isOkay = await Bun.password.verify(plainPassword, this.password);
  return isOkay;
});

UserSchema.method("tryPopulateAll", async function () {
  const popped = await this.populate<
    Pick<
      IPopulatedUser,
      | "ingredients"
      | "recipe_exclusions"
      | "ingredient_exclusions"
      | "dietary_preferences"
    >
  >([
    "ingredients",
    "recipe_exclusions",
    "ingredient_exclusions",
    "dietary_preferences",
  ]);
  if (
    !this.populated("ingredients") ||
    !this.populated("recipe_exclusions") ||
    !this.populated("ingredient_exclusions") ||
    !this.populated("dietary_preferences")
  ) {
    return null;
  }
  return popped;
});

UserSchema.static(
  "findByIdAndPopulate",
  async function findByIdAndPopulate(
    id: string | Types.ObjectId
  ): Promise<User | null> {
    let user = await this.findById(id);
    if (!user) {
      return null;
    }
    let popped = await user.tryPopulateAll();
    if (popped) {
      return popped;
    }
    return null;
  }
);

UserSchema.static(
  "findOneAndPopulate",
  async function findOneAndPopulate(query: any): Promise<User | null> {
    let user = await this.findOne(query);
    if (!user) {
      return null;
    }
    let popped = await user.tryPopulateAll();
    if (popped) {
      return popped;
    }
    return null;
  }
);

UserSchema.static(
  "newUser",
  async function newUser(auth: {
    email: string;
    password: string;
  }): Promise<User | string | null> {
    let existing = await this.findOne({ email: auth.email });
    if (existing) {
      return "email already exists";
    }
    let user = new Users();
    let ingredients = new IngredientsLists({ list: [] });
    let recipe_exclusions = new RecipeExclusionsLists({ list: [] });
    let ingredient_exclusions = new IngredientExclusionsLists({ list: [] });
    let dietary_preferences = new DietaryPreferencesLists({ list: [] });
    user.email = auth.email;
    await user.setPassword(auth.password);
    user.last_request = new Date(Date.now() - RATE_LIMIT);
    user.ingredients = ingredients._id;
    user.recipe_exclusions = recipe_exclusions._id;
    user.ingredient_exclusions = ingredient_exclusions._id;

    const val_err = await user.validateSync();
    if (val_err) {
      return val_err.toString();
    }

    await user.save();
    await ingredients.save();
    await recipe_exclusions.save();
    await ingredient_exclusions.save();

    return user.tryPopulateAll();
  }
);

const Users = model<IUser, UserModel>("User", UserSchema);

//================================================================================================//
//==| EXPORTS |===================================================================================//
//================================================================================================//

/// The type of a User record, which stores user information.
/// This is the type returned by queries such as findOne and findById.
type User = HydratedDocument<IPopulatedUser, IUserMethods>;
/// The type of a list of ingredients.
type IngredientsList = HydratedDocument<IList, {}>;
/// The type of a list of recipe exclusions.
type RecipeExclusionsList = HydratedDocument<IList, {}>;
/// The type of a list of ingredient exclusions.
type IngredientExclusionsList = HydratedDocument<IList, {}>;
/// The type of a list of dietary preferences
type DietaryPreferencesList = HydratedDocument<IList, {}>;

const DB = await connect(MONGODB_URL);

export {
  Users,
  IngredientsLists,
  RecipeExclusionsLists,
  IngredientExclusionsLists,
  DietaryPreferencesLists,
};
export type {
  User,
  IngredientsList,
  RecipeExclusionsList,
  IngredientExclusionsList,
  DietaryPreferencesList,
};
