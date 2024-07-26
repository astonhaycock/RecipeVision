<script setup lang="ts">
  import type { RecipeCard } from "@/scripts/allrecipes";
  import { inject, ref, type Ref } from "vue";

  const mobile = inject("mobile") as Ref<boolean>;

  const props = defineProps<{
    recipe: RecipeCard;
  }>();
  const isHovering = ref(false);

  const starColor = ref("yellow-darken-4");
  function openModal() {
    if (!isHovering.value) {
      isHovering.value = true;
    } else {
      isHovering.value = false;
    }
  }
</script>

<template>
  <div @click="openModal">
    <v-hover v-slot="{ isHovering, props }">
      <v-card class="mx-auto" max-width="344" v-bind="props" height="500">
        <div class="d-flex justify-center align-center">
          <v-img :src="recipe.image as string" height="300px" width="400px" />
        </div>

        <v-card-title class="d-flex flex-column align-center">
          <v-rating
            :model-value="recipe.stars as number"
            background-color="orange"
            class="me-2"
            color="orange"
            dense
            hover
            readonly></v-rating>
          <span class="text-subtitle-2">{{ recipe.reviews }} Reviews</span>
        </v-card-title>
        <v-card-text class="d-flex flex-column align-center me-2">
          <h2 class="text-h6 text-center">{{ recipe.title }}</h2>
        </v-card-text>

        <v-overlay
          :model-value="isHovering as boolean"
          class="align-center justify-center"
          scrim="#036358"
          contained>
          <a :href="recipe.url as string" target="_blank" class="ma-4"
            ><v-btn variant="flat">See more info</v-btn></a
          >
        </v-overlay>
      </v-card>
    </v-hover>
  </div>
</template>

<style scoped>
  h2,
  span {
    color: #0091ea;
  }
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
