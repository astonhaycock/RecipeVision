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
  const response = await axios({
    method: "get",
    url: `${import.meta.env.VITE_PUBLIC_URL}?q=${query.replace(/ /g, "+")}`,
    withCredentials: false,
  });
  const selector = cheerio.load(response.data);
  let el = selector(".mntl-card-list-items").first();

  const recipes = [];

  for (;;) {
    const title = el.find(".card__title-text").text();
    const id = el.attr("data-doc-id");
    const url = el.attr("href");
    const image = el.find("img").attr("data-src");
    const stars =
      el.find(".icon-star").length + el.find(".icon-star-half").length * 0.5;
    const reviews = parseInt(
      el
        .find(".mntl-recipe-card-meta__rating-count-number")
        .text()
        .replace(/,/g, "")
    );

    recipes.push({
      title: title || null,
      id: id || null,
      url: url || null,
      image: image || null,
      stars: stars || null,
      reviews: reviews || null,
    });

    if (el.next().length === 0) {
      break;
    }
    el = el.next();
  }

  return { query, cards: recipes };
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