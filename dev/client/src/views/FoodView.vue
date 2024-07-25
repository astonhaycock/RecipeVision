<script setup lang="ts">
import { search_multiple, type RecipeCollection } from "@/scripts/allrecipes";
import loading from "../assets/loading.gif";
import IngredientList from "../components/Ingredient.vue";
import RecipeList from "../components/recipes/Recipe.vue";
import { onBeforeMount, defineEmits, inject } from "vue";
import { ref, type Ref } from "vue";

const ingredients = inject("ingredients") as Ref<string[]>;
const recipes = inject("recipes") as Ref<RecipeCollection>;
const recipe_ideas = inject("recipe_ideas") as Ref<string[]>;
const populateRecipes = inject("populateRecipes") as (
  force: boolean
) => Promise<void>;

// const ingredient = ref("#4400ff");
// const modal = ref(false);
const loading_screen = ref(true);
const reviewList: Ref<string[]> = ref([]);
const emit = defineEmits(["login"]);

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
