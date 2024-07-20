<script setup lang="ts">
import RecipeTile from "@/components/recipes/RecipeTile.vue";
import type { RecipeListWithQuery, RecipeCard } from "@/scripts/allrecipes";

const props = defineProps<{
  recipes: RecipeListWithQuery;
}>();
</script>

<template>
  <v-sheet tag="v-container" class="mx-10 mt-8" color="grey-lighten-1" rounded>
    <v-row>
      <v-sheet
        color="grey-lighten-2"
        rounded="pill"
        class="px-4 py-1 mt-4 ml-6 w-auto"
      >
        <v-text class="text-h6 text-capitalize">
          {{ props.recipes.query }}
        </v-text>
      </v-sheet>
      <v-spacer></v-spacer>
    </v-row>

    <v-slide-group show-arrows class="mt-2">
      <v-slide-group-item v-for="(card, key) in props.recipes.cards">
        <RecipeTile :recipe="card" />
        <!-- <v-sheet
          class="ma-3"
          color="grey-lighten-1"
          height="200"
          width="250"
          rounded
        ></v-sheet> -->
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>
