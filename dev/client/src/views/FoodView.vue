<script setup lang="ts">
import { search_multiple, type RecipeCollection } from "@/scripts/allrecipes";
import loading from "../assets/loading.gif";
import IngredientList from "../components/Ingredient.vue";
import RecipeList from "../components/recipes/Recipe.vue";
import { onBeforeMount, defineEmits } from "vue";
import { ref, type Ref } from "vue";

const ingredients: Ref<Array<string>> = ref([]);
const recipes: Ref<RecipeCollection> = ref({});
const recipe_ideas: Ref<Array<string>> = ref([]);
// const ingredient = ref("#4400ff");
// const modal = ref(false);
const loading_screen = ref(true);
const reviewList: Ref<string[]> = ref([]);
const emit = defineEmits(["login"]);

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
    credentials: "same-origin",
  });
  if (result.status === 200) {
    const arr: Array<string> = await result.json();
    fetchRecipes(arr);
  }
}

async function fullRefresh() {
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
    credentials: "same-origin",
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

function handleReviewIngredients(data: string[]) {
  reviewList.value = data;
  loading_screen.value = false;
}
onBeforeMount(async () => {
  emit("login");
});
</script>

<template>
  <v-main>
    <RecipeList v-model:recipes="recipes" />
    <IngredientList
      v-model:ingredients="ingredients"
      @ingredient-change="populateRecipes"
    />
  </v-main>
</template>

<style scoped></style>
