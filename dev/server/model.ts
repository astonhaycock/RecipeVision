
type Ingredients = string[];

type Recipe = {
    title: string,
    description: string,
    url: string,
    cook_time: number,
    ingredients: Ingredients
}

type UserData = {
    username: string,
    email: string,
    // hashed password
    ingredients: Ingredients,
}
