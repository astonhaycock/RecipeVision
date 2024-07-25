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
const selected: Ref<string> = ref("");
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
app.provide("ingredients", ingredients);
app.provide("recipes", recipes);
app.provide("recipe_ideas", recipe_ideas);
app.provide("selected", selected);

async function fetchRecipes(ideas: string[]) {
  // remove entries currently found as keys in `recipes`
  const filtered = ideas.filter((item) => !recipes.value[item]);
  search_multiple(filtered, (result) => {
    recipes.value[result.query] = result.cards;
    recipe_ideas.value.push(result.query);
  });
}

//TODO: Proper way to handle this is to receive an event to invalidate the cache.
let old_length = ingredients.value.length;
async function populateRecipes(force: boolean = false) {
  console.log("Populating recipes...");
  console.log(force, ingredients.value.length, old_length);
  const data = ingredients.value;
  if (!force) {
    if (data.length < 5) {
      console.log("Not enough ingredients.");
      return;
    }
    if (old_length >= data.length) {
      console.log("No change in ingredients.");
      return;
    }
  }
  old_length = ingredients.value.length;
  const result = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/recipes`, {
    credentials: "include",
  });
  if (result.status === 200) {
    const arr: Array<string> = await result.json();
    fetchRecipes(arr);
  }
}

async function fullRecipeRefresh() {
  if (ingredients.value.length < 5) {
    return;
  }

  //TODO: Loading screen or some other indicator.
  //TODO: Wiping the screen should serve in the meantime.
  const old_recipes = recipes.value;
  const old_ideas = recipe_ideas.value;
  recipes.value = {};
  recipe_ideas.value = [];

  const result = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/recipes`, {
    credentials: "include",
  });
  if (result.status === 200) {
    const data: Array<string> = await result.json();
    fetchRecipes(data);
    return;
  }
  //TODO: Some indicator of failure here.
  recipes.value = old_recipes;
  recipe_ideas.value = old_ideas;
}

populateRecipes(true);

app.provide("populateRecipes", populateRecipes);
app.provide("fullRecipeRefresh", fullRecipeRefresh);

app.mount("#app");
