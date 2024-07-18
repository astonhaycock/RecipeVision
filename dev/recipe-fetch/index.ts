interface IRecipe {}

/**
 * Get recipes from allrecipes.com
 * This function requires the search string to consist of lowercase letters and single spaces only.
 * @param search The recipe to search for
 */
async function allrecipes(search: string): Promise<IRecipe> {
  const response = await fetch(
    `https://www.allrecipes.com/search/?q=${search.replace(" ", "+")}`
  );
  console.log(response);
  throw new Error("Not implemented");
}

allrecipes("caprese salad");
