class ParseError<T> extends Error {
  type_name: string;
  constructor(type: { new (): T }) {
    super(`Unable to parse environment variable as ${type.name}`);
    this.type_name = type.name;
  }
}

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
    if (error instanceof ParseError) {
      throw error;
    }
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

/// The port to listen on
const PORT = envp<number>("PORT", 8080);
/// The rate limit for requests in milliseconds
const RATE_LIMIT = envp<number>("RATE_LIMIT", 15_000);
/// The path to serve the website files
const WEBSITE_PATH = env("WEBSITE_PATH", "../client");
/// The path to serve the images to OpenAI
const IMAGES_PATH = env("IMAGES_PATH", "../images");
/// The public URL of the website, primarily for OpenAI
const PUBLIC_URL = env("PUBLIC_URL");
/// The OpenAI API key
const OPENAI_KEY = env("OPENAI_KEY");
/// The MongoDB connection string
const MONGODB_URL = env("MONGODB_URL");
/// The session secret
const SESSION_SECRET = env("SESSION_SECRET", "your-secret-key");

export {
  PORT,
  RATE_LIMIT,
  WEBSITE_PATH,
  IMAGES_PATH,
  PUBLIC_URL,
  OPENAI_KEY,
  MONGODB_URL,
  SESSION_SECRET,
};
