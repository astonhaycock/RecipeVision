<script setup lang="ts">
import RecipeTile from "@/components/recipes/RecipeTile.vue";
import type { RecipeListWithQuery, RecipeCard } from "@/scripts/allrecipes";
import { inject, onMounted, reactive, watch, type Ref } from "vue";

const mobile = inject("mobile") as Ref<boolean>;

const style = reactive<{
  pill_label: string;
  container: string;
}>({ pill_label: "", container: "" });

function update() {
  if (mobile.value) {
    style.container = "mx-1 mt-4 mb-6";
    style.pill_label = "px-4 py-1 mt-2 ml-6 w-auto";
  } else {
    style.container = "mx-10 mt-16 mb-16";
    style.pill_label = "px-4 py-1 mt-4 ml-6 w-auto";
  }
}

watch(mobile, update);
onMounted(update);

const props = defineProps<{
  recipes: RecipeListWithQuery;
}>();
</script>

<template>
  <v-sheet tag="v-container" :class="style.container" color="grey-lighten-4">
    <v-row color="grey-lighten-4">
      <!-- <v-spacer></v-spacer> -->
      <v-sheet color="grey-lighten-2" rounded="pill" :class="style.pill_label">
        <div class="text-h6 text-capitalize">
          {{ props.recipes.query }}
        </div>
      </v-sheet>
      <v-spacer></v-spacer>
    </v-row>

    <v-slide-group class="mt-2 px-2" :mobile="mobile" :show-arrows="!mobile">
      <v-slide-group-item v-for="(card, key) in props.recipes.cards">
        <RecipeTile class="pa-5" :recipe="card" />
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
