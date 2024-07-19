<script setup lang="ts">
import RecipeRow from "./RecipeRow.vue";
</script>

<template>
  <v-main class="position-absolute top-0 mx-0 px-0 w-100 bg-grey-lighten-4">
    <v-container class="mx-auto" fluid>
      <v-row class="my-4">
        <v-spacer></v-spacer>
        <v-text class="text-h3">Recipes</v-text>
        <v-spacer></v-spacer>
      </v-row>
      <RecipeRow />
    </v-container>
  </v-main>
</template>
<style scoped>
#iframe {
  z-index: top;
}
</style>
