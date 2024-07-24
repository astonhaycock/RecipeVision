<script setup lang="ts">
import loading from "../assets/loading.gif";
import IngredientList from "../components/Ingredient.vue";
import RecipeList from "../components/recipes/Recipe.vue";
import { onBeforeMount, defineEmits } from "vue";
import { ref, type Ref } from "vue";

const ingredients: Ref<Array<string>> = ref([]);
// const ingredient = ref("#4400ff");
// const modal = ref(false);
const loading_screen = ref(true);
const reviewList: Ref<string[]> = ref([]);
const emit = defineEmits(["login"]);

let cooldown = false;
let waiting = false;

async function populateRecipes(data: string[]) {
  ingredients.value = data;
  if (cooldown) waiting = true;
  else {
    cooldown = true;
    setTimeout(() => {
      cooldown = false;
      if (waiting) {
        waiting = false;
        populateRecipes(data);
      }
    }, 5_000);
  }
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
    <RecipeList />
    <IngredientList
      v-bind:ingredients="ingredients"
      @update:ingredients="populateRecipes"
    />
  </v-main>
</template>

<style scoped></style>
