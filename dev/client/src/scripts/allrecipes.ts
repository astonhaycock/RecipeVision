import axios from "axios";
import * as cheerio from "cheerio";

/**
 * This interface represents the data of a recipe card.
 * All fields are nullable because the data is obtained by scraping.
 * Handle with care.
 */
interface RecipeCard {
  title: string | null;
  id: string | null;
  url: string | null;
  image: string | null;
  stars: number | null;
  reviews: number | null;
}

// hooray, verbosity
type RecipeListWithQuery = { query: string; cards: RecipeCard[] };

/**
 * This interface represents a list of recipes.
 */
type RecipeCollection = { [key: string]: RecipeCard[] };

/**
 * This function searches for recipes on AllRecipes.com and gathers the data into a list.
 * This function expects the search query to consist of only letters and spaces.
 * @param query The search query
 */
async function search(query: string): Promise<RecipeListWithQuery> {
  const response = await fetch(
    `${import.meta.env.VITE_PUBLIC_URL}/api/allrecipes/${encodeURIComponent(
      query
    )}`
  );
  if (response.status === 200) {
    return response.json();
  }
  return Promise.reject();
}

/**
 * This function searches for multiple recipes on AllRecipes.com.
 * When each search is complete, the callback function is called with the results.
 * This function assumes each query consists of only letters and spaces.
 * @param queries The search queries
 */
function search_multiple(
  queries: string[],
  callback: (result: RecipeListWithQuery) => void
) {
  for (const query of queries) {
    search(query).then(callback);
  }
}

export { search_multiple };
export type { RecipeCard, RecipeListWithQuery, RecipeCollection };
