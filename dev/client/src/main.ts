import "@mdi/font/css/materialdesignicons.css";
import "./assets/main.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { createApp, ref, watch, type Ref } from "vue";
import App from "./App.vue";
import router from "./router";
import { useMediaQuery } from "@vueuse/core";
import { search_multiple, type RecipeCollection } from "./scripts/allrecipes";

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
});

const mobile_width = useMediaQuery("(max-width: 800px)");
const mobile_aspect = useMediaQuery("(max-aspect-ratio: 5/8)");
const mobile = ref(false);
function mobile_update() {
  mobile.value = mobile_width.value && mobile_aspect.value;
}
watch([mobile_width, mobile_aspect], mobile_update);
mobile_update();

app.use(vuetify);
app.use(router);
app.provide("current_user", { email: "", IngredientList: "" });
app.provide("mobile", mobile);
app.provide("recipe_modal", ref(null));

const ingredients: Ref<Array<string>> = ref([]);
const recipes: Ref<RecipeCollection> = ref({});
const recipe_ideas: Ref<Array<string>> = ref([]);
const recipes_generated: Ref<boolean> = ref(false);
let recipe_debounce = false;
let recipe_queue = false;
let refresh_queue = false;
app.provide("ingredients", ingredients);
app.provide("recipes", recipes);
app.provide("recipe_ideas", recipe_ideas);
app.provide("recipes_generated", recipes_generated);

async function fetchScraped(ideas: string[]) {
  // try {
  //   throw new Error();
  // } catch (e) {
  //   console.log(
  //     "\n" +
  //       "====== ====== ====== BEGIN STACK TRACE ====== ====== ======\n" +
  //       (e as Error).stack +
  //       "\n\n\n"
  //   );
  //   return;
  // }

  // remove entries currently found as keys in `recipes`
  const filtered = ideas.filter((item) => !recipes.value[item]);
  search_multiple(filtered, (result) => {
    recipes.value[result.query] = result.cards;
    recipe_ideas.value.push(result.query);
  });
}

async function fetchIngredients() {
  const result = await fetch(
    `${import.meta.env.VITE_PUBLIC_URL}/api/ingredients`,
    {
      credentials: "include",
    }
  );
  if (result.status === 200) {
    const arr: Array<string> = await result.json();
    old_length = arr.length;
    ingredients.value = arr;
    return true;
  }
  return false;
}

async function fetchRecipes() {
  fetchIngredients();
  const result = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/recipes`, {
    credentials: "include",
  });
  if (result.status === 200) {
    const arr: Array<string> = await result.json();
    fetchScraped(arr);
    return true;
  }
  return false;
}

//TODO: Proper way to handle this is to receive an event to invalidate the cache.
let old_length = ingredients.value.length;
async function populateRecipes(init: boolean = false) {
  const data = ingredients.value;
  if (init) {
    // If this is called as part of the init process, we want to set a flag
    // so it doesn't get called again before the results come back.
    if (recipes_generated.value) {
      console.log("Recipes already generated.");
      return;
    }
    recipes_generated.value = true;
  } else {
    // We don't want to check this as part of the init process,
    // because we don't want to wait synchronously for the ingredients.
    if (data.length < 5) {
      console.log("Not enough ingredients.");
      return;
    }
    if (old_length >= data.length) {
      console.log("No change in ingredients.");
      return;
    }
    if (recipe_debounce) {
      recipe_queue = true;
      console.log("Recipe debounce.");
      return;
    }
    recipe_debounce = true;
    setTimeout(() => {
      recipe_debounce = false;
      if (refresh_queue) {
        refresh_queue = false;
        recipe_queue = false;
        fullRecipeRefresh();
        return;
      }
      if (recipe_queue) {
        recipe_queue = false;
        populateRecipes();
      }
    }, 7_500);
  }

  old_length = ingredients.value.length;
  if (await fetchRecipes()) {
    return;
  }
}

async function fullRecipeRefresh() {
  if (ingredients.value.length < 5) {
    return;
  }
  if (recipe_debounce) {
    recipe_queue = true;
    console.log("Recipe debounce.");
    return;
  } else {
    recipe_debounce = true;
    setTimeout(() => {
      recipe_debounce = false;
      if (refresh_queue) {
        refresh_queue = false;
        recipe_queue = false;
        fullRecipeRefresh();
        return;
      }
      if (recipe_queue) {
        recipe_queue = false;
        populateRecipes();
      }
    }, 7_500);
  }

  //TODO: Loading screen or some other indicator.
  //TODO: Wiping the screen should serve in the meantime.
  const old_recipes = recipes.value;
  const old_ideas = recipe_ideas.value;
  recipes.value = {};
  recipe_ideas.value = [];

  if (await fetchRecipes()) {
    return;
  }
  //TODO: Some indicator of failure here.
  recipes.value = old_recipes;
  recipe_ideas.value = old_ideas;
}

app.provide("populateRecipes", populateRecipes);
app.provide("fullRecipeRefresh", fullRecipeRefresh);

app.mount("#app");
