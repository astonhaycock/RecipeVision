<script setup lang="ts">
import type { RecipeCard } from "@/scripts/allrecipes";
import { ref } from "vue";

const props = defineProps<{
  recipe: RecipeCard;
}>();

const starColor = ref("yellow-darken-4");
</script>

<template>
  <a :href="recipe.url" target="_blank" class="ma-4">
    <div id="main" class="bg-grey-lighten-4">
      <img :src="recipe.image as string" />
      <div id="banner" class="bg-grey-lighten-2">
        <h3>{{ recipe.title }}</h3>
        <div class="d-flex">
          <v-icon
            icon="mdi-star"
            :color="starColor"
            v-for="i in Math.floor(recipe.stars)"
          />
          <v-icon
            icon="mdi-star-half-full"
            :color="starColor"
            v-if="recipe.stars % 1"
          />
          <v-icon
            icon="mdi-star-outline"
            :color="starColor"
            v-if="recipe.stars <= 4"
            v-for="i in 5 - Math.floor(recipe.stars)"
          />
          <p class="pl-4">Reviews: {{ recipe.reviews }}</p>
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped>
#main {
  position: relative;
  border-radius: 5px;
  height: 300px;
  max-width: 600px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: start;
}
img {
  margin: 0px auto;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  height: 225px;
  width: auto;
}

#banner {
  margin: 0px;
  width: 100%;
  margin-top: 10px;
  padding: 0px 10px;
}

a {
  text-decoration: none;
}
</style>
