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

async function populateRecipes(data: string[]) {
  if (data.length === 0) {
    return;
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
      v-model:ingredients="ingredients"
      @ingredient-change="populateRecipes"
    />
  </v-main>
</template>

<style scoped></style>
