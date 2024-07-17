// This file reads environment variables and exports them for use in the rest of the codebase.
// This file also specifies default values, if any.

/**
 * This function will read an environment variable, check if it's null, and
 * optionally substitute a default value if it is.
 * If the environment variable is not set and no default value is provided, an
 * error will be thrown.
 * @param name The name of the environment variable to read
 * @param or The optional default value to use if the environment variable is not set
 * @returns The value of the environment variable or default value
 */
function env(name: string, or?: string): string {
  const value = Bun.env[name];
  if (value === undefined) {
    if (or === undefined) {
      throw new Error(`unable to find required env var ${name}`);
    }
    console.log(`unable to find env var ${name}, defaulting to ${or}`);
    return or;
  }
  return value;
}

/**
 * This function will read an environment variable, check if it's null, and
 * optionally substitute a default value if it is.
 * If the environment variable is not set and no default value is provided, an
 * error will be thrown.
 * This function will also attempt to parse the environment variable as the given type,
 * using JSON.parse.
 * @param name The name of the environment variable to parse
 * @param or The optional default value to use if the environment variable is not set
 * @returns The value of the environment variable or default value
 */
function envp<T>(name: string, or?: T): T {
  const value = Bun.env[name];
  if (value === undefined) {
    if (or === undefined) {
      throw new Error(`unable to find required env var ${name}`);
    }
    console.log(`unable to find env var ${name}, defaulting to ${or}`);
    return or;
  }
  let parsed: T;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    throw new Error(`error occurred while parsing env var ${name}`);
  }
  if (parsed === undefined) {
    if (or === undefined) {
      throw new Error(`error occurred while parsing required env var ${name}`);
    }
    console.warn(
      `error occurred while parsing env var ${name}, defaulting to ${or}`
    );
    return or;
  }
  return parsed;
}

/// The maximum upload size in bytes
const FILE_LIMIT = envp<number>("FILE_LIMIT", 100 * 1024 * 1024);
/// The port to listen on
const PORT = envp<number>("PORT", 8080);
/// The rate limit for requests in milliseconds
const RATE_LIMIT = envp<number>("RATE_LIMIT", 15_000);
/// The path to serve the website files
const WEBSITE_PATH = env("WEBSITE_PATH", "../client");
/// The path to serve the images to OpenAI
const IMAGES_PATH = env("IMAGES_PATH", "../images");
/// The OpenAI API key
const OPENAI_KEY = env("OPENAI_KEY");
/// The MongoDB connection string
const MONGODB_URL = env("MONGODB_URL");
/// The session secret
const SESSION_SECRET = env("SESSION_SECRET", "your-secret-key");
/// The cookie expiration time in milliseconds
const COOKIE_EXPIRATION = envp<number>(
  "COOKIE_EXPIRATION",
  1000 * 60 * 60 * 24 * 7
);
/// The prompt to use for the OpenAI API when reading images
const IMAGE_PROMPT = env(
  "IMAGE_PROMPT",
  "Give me a list of cooking ingredients in this image, if any, as a JSON array of strings. " +
    "If no ingredients are present, return an empty JSON array. Keep each ingredient generic " +
    "and do not include brand information. Return only the JSON array, with no description, " +
    "context, or formatting."
);
/// The prompt to use for recipe generation
const RECIPE_PROMPT = env(
  "RECIPE_PROMPT",
  "Give me a list of recipe ideas that can be made using a subset of the provided list " +
    "of ingredients. " +
    "Provide the name of the idea only, such that I can search for each idea on a recipe website. " +
    "Return the list as a JSON array of strings. " +
    "It is permissible to include a few recipes that use a couple additional ingredients. " +
    "If no ideas can be generated using the provided ingredients, return an empty JSON array."
);

let url = env("PUBLIC_URL");
// sanitize the URL so it plays nicely with the rest of the code
if (!url.startsWith("http")) {
  url = `http://${url}`;
}
if (url.endsWith("/")) {
  url = url.slice(0, -1);
}
/// The public URL of the website, primarily for OpenAI to pull pictures from
const PUBLIC_URL = url;

export {
  FILE_LIMIT,
  PORT,
  RATE_LIMIT,
  WEBSITE_PATH,
  IMAGES_PATH,
  PUBLIC_URL,
  OPENAI_KEY,
  MONGODB_URL,
  SESSION_SECRET,
  COOKIE_EXPIRATION,
  IMAGE_PROMPT,
  RECIPE_PROMPT,
};
