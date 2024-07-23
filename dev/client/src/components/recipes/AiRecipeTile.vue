<script setup lang="ts">
  import type { AiCard } from "@/scripts/airecipes";
  import { ref } from "vue";

  const props = defineProps<{
    recipe: AiCard;
  }>();
  const isHovering = ref(false);
  const URL_image = `${import.meta.env.VITE_PUBLIC_URL}/api/ai/image/`;

  const starColor = ref("yellow-darken-4");
  const recipe_overlay = ref(false);
  const selectedRecipe = {};
</script>

<template>
  <div>
    <v-hover v-slot="{ isHovering, props }">
      <v-card class="mx-auto pt-6" max-width="344" v-bind="props" height="500">
        <div class="d-flex justify-center align-center">
          <v-img
            :src="URL_image + recipe.image"
            loading
            height="300px"
            width="400px"
            lazy-src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2">
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
              </div> </template
          ></v-img>
        </div>
        <v-card-text class="d-flex flex-column align-center me-2">
          <h2 class="text-h6 text-primary text-center">{{ recipe.title }}</h2>
        </v-card-text>
        <v-card-text class="d-flex flex-column align-center me-2">
          <p class="text-primary text-center">{{ recipe.description }}</p>
        </v-card-text>

        <v-overlay
          :model-value="isHovering"
          class="align-center justify-center"
          scrim="#036358"
          contained>
          <a class="ma-4"
            ><v-btn variant="flat" @click="$emit('openModal')">See more info</v-btn></a
          >
        </v-overlay>
      </v-card>
    </v-hover>
  </div>
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
