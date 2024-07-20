<script setup lang="ts">
import type { RecipeCard } from "@/scripts/allrecipes";

const props = defineProps<{
  recipe: RecipeCard;
}>();
</script>

<template>
  <v-card height="400" max-width="400" class="pa-0 ma-4">
    <v-img
      :src="recipe.image as string"
      height="300px"
      class="position-relative top-0 left-0 ma-0"
    />
    <v-card-title class="text-body-3 text-wrap mt-2"
      ><p class="text-body-3">{{ recipe.title as string }}</p></v-card-title
    >
    <v-card-actions> </v-card-actions>
  </v-card>
</template>
