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
import { MONGODB_URL, DEMO_AUTH, RATE_LIMIT } from "./env";

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
//==| AI GENERATED RECIPES & SCHEMAS |============================================================//
//================================================================================================//

// IAiRecipe is fun to type
interface IAiRecipe {
  title: string;
  description: string;
  cook_time: string;
  ingredients: Array<string>;
  instructions: Array<string>;
  tags: Array<string>;
  image: string;
  user: Types.ObjectId;
}
const AiRecipeSchema = new Schema<IAiRecipe>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  cook_time: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  tags: { type: [String], required: true },
  image: { type: String, required: true },
});
const AiRecipes = model<IAiRecipe>("AI_Recipe", AiRecipeSchema);

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
  demo_account?: boolean;
}

interface IPopulatedUser {
  email: string;
  password: string;
  last_request: Date;
  ingredients: IngredientsList;
  recipe_exclusions: RecipeExclusionsList;
  ingredient_exclusions: IngredientExclusionsList;
  dietary_preferences: DietaryPreferencesList;
  demo_account: boolean;
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

  /**
   * Create a new demo user with demo ingredients.
   */
  newDemoUser(): Promise<User | null>;
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
  demo_account: { type: Boolean, default: false, required: false },
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
    auth.email = auth.email.toLowerCase();
    let existing = await this.findOne({ email: auth.email });
    if (existing) {
      return "email already exists";
    }
    if (
      typeof auth.password !== "string" ||
      auth.password.length < 8 ||
      auth.password.length > 64 ||
      !auth.password.match(/\d/) ||
      !auth.password.match(/[a-z]/) ||
      !auth.password.match(/[A-Z]/) ||
      !auth.password.match(/[^a-zA-Z\d]/)
    ) {
      return "password must be 8-64 characters, with at least one digit, lowercase letter, uppercase letter, and special character";
    }

    const user = new Users();
    const ingredients = new IngredientsLists({ list: [] });
    const recipe_exclusions = new RecipeExclusionsLists({ list: [] });
    const ingredient_exclusions = new IngredientExclusionsLists({ list: [] });
    const dietary_preferences = new DietaryPreferencesLists({ list: [] });
    user.email = auth.email;
    await user.setPassword(auth.password);
    user.last_request = new Date(Date.now() - RATE_LIMIT);
    user.ingredients = ingredients._id;
    user.recipe_exclusions = recipe_exclusions._id;
    user.ingredient_exclusions = ingredient_exclusions._id;
    user.dietary_preferences = dietary_preferences._id;

    const val_err = await user.validateSync();
    if (val_err) {
      return val_err.toString();
    }

    await user.save();
    await ingredients.save();
    await recipe_exclusions.save();
    await ingredient_exclusions.save();
    await dietary_preferences.save();

    return user.tryPopulateAll();
  }
);

if (DEMO_AUTH) {
  UserSchema.static("newDemoUser", async function newDemoUser() {
    const user = new Users();
    const ingredients = new IngredientsLists({
      list: [
        //TODO: Add more
        "chicken",
        "beef",
        "rice",
        "basil",
        "mixed vegetables",
        "tomato",
        "onion",
        "garlic",
        "olive oil",
        "salt",
        "pepper",
      ],
    });
    const recipe_exclusions = new RecipeExclusionsLists({ list: [] });
    const ingredient_exclusions = new IngredientExclusionsLists({ list: [] });
    const dietary_preferences = new DietaryPreferencesLists({ list: [] });
    user.demo_account = true;
    user.recipe_exclusions = recipe_exclusions._id;
    user.ingredients = ingredients._id;
    user.ingredient_exclusions = ingredient_exclusions._id;
    user.dietary_preferences = dietary_preferences._id;
    user.last_request = new Date(0);
    user.email = `DEMO-${crypto.randomUUID()}@recipevision.com`;
    // 100% secure!
    user.password = "DEMO";
    const val_err = await user.validateSync();
    if (val_err) {
      console.error(`Internal error: ${val_err}`);
      return null;
    }

    await user.save();
    await ingredients.save();
    await recipe_exclusions.save();
    await ingredient_exclusions.save();
    await dietary_preferences.save();

    return user.tryPopulateAll();
  });
} else {
  UserSchema.static("newDemoUser", async function newDemoUser() {
    return null;
  });
}

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
/// The type of a recipe generated by the AI.
type AiRecipe = HydratedDocument<IAiRecipe, {}>;

const DB = await connect(MONGODB_URL);

export {
  Users,
  AiRecipes,
  IngredientsLists,
  RecipeExclusionsLists,
  IngredientExclusionsLists,
  DietaryPreferencesLists,
};
export type {
  User,
  AiRecipe,
  IngredientsList,
  RecipeExclusionsList,
  IngredientExclusionsList,
  DietaryPreferencesList,
};
