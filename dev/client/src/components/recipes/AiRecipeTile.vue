<script setup lang="ts">
  import type { AiCard } from "@/scripts/airecipes";
  import { ref } from "vue";

  const props = defineProps<{
    recipe: AiCard;
  }>();
  const isHovering = ref(false);

  const starColor = ref("yellow-darken-4");
</script>

<template>
  <div>
    <v-hover v-slot="{ isHovering, props }">
      <v-card class="mx-auto" max-width="344" v-bind="props" height="500">
        <div class="d-flex justify-center align-center">
          <v-img
            :src="recipe.image"
            loading
            height="300px"
            width="400px"
            lazy-src="@/assets/loadingscreen.jpeg">
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
              </div> </template
          ></v-img>
        </div>

        <v-card-text class="d-flex flex-column align-center me-2">
          <h2 class="text-h6 text-primary text-center">{{ recipe.title }}</h2>
        </v-card-text>

        <!-- <v-overlay
          :model-value="isHovering"
          class="align-center justify-center"
          scrim="#036358"
          contained>
          <a :href="recipe.image" target="_blank" class="ma-4"
            ><v-btn variant="flat">See more info</v-btn></a
          >
        </v-overlay> -->
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
