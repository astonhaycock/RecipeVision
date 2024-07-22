<script setup lang="ts">
  import loading from "../assets/loading.gif";
  import IngredientList from "../components/Ingredient.vue";
  import RecipeList from "../components/recipes/Recipe.vue";
  import { defineComponent, onBeforeMount, defineEmits } from "vue";
  import { ref, type Ref } from "vue";
  const URL = "https://dont-pani.cc";

  const ingredients: Ref<string[]> = ref([]);
  const ingredient = ref("#4400ff");
  const modal = ref(false);
  const loading_screen = ref(true);
  const reviewList: Ref<string[]> = ref([]);
  const emit = defineEmits(["login"]);

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
    <IngredientList />
  </v-main>
</template>

<style scoped></style>
