/**
 * This interface represents the data of a recipe card.
 * All fields are nullable because the data is obtained by scraping.
 * Handle with care.
 */
interface AiCard {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  image: string;
}
type AiRecipeCollection = AiCard[];

export type { AiRecipeCollection, AiCard };
