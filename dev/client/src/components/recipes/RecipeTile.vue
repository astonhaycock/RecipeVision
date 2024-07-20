<script setup lang="ts">
import type { RecipeCard } from "@/scripts/allrecipes";

const props = defineProps<{
  recipe: RecipeCard;
}>();
</script>

<template>
  <div id="main">
    <img :src="props.recipe.image as string" alt="recipe image" height="300" />
    <div id="inlay">
      <h3>{{ props.recipe.title }}</h3>
      <div id="row">
        <p>Stars: {{ props.recipe.stars }}</p>
        <p>Reviews: {{ props.recipe.reviews }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
#main {
  margin: 10px;
  max-width: 600px;
  display: table;
}
#inlay {
  display: table-caption;
  position: relative;
  width: 100%;
  height: 75px;
  bottom: 75px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  color: white;
}
#row {
  display: flex;
  justify-content: space-around;
}
</style>
