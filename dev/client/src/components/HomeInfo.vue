<script setup lang="ts">
  import { defineProps, onMounted, reactive, watch, ref, inject, type Ref } from "vue";

  const mobile = inject("mobile") as Ref<boolean>;
</script>

<template>
  <v-sheet id="container" class="d-flex flex-column ga-2 pt-5 align-center w-100" elevation="24">
    <h1>How it Works</h1>
    <p id="info-text">
      RecipeVision aims to simplify the cooking experience by providing a digital pantry that AI
      analyzes to generate recipes for the user based on what they have in their pantry.
    </p>
    <div id="steps" class="d-flex w-75 justify-center">
      <div id="text-box" class="d-flex flex-column align-center">
        <h2>Add Ingredients</h2>
        <p>
          Set out all your ingredients on a table and snap a photo. Then AI will analyze the photo
          to identify each ingredient.
        </p>
      </div>
      <div id="text-box" class="d-flex flex-column align-center">
        <h2>Generate Recipe</h2>
        <p>
          With our app, you can generate a brand new recipe using AI or we will suggest recipes
          based on what you have in your pantry.
        </p>
      </div>
      <div id="text-box" class="d-flex flex-column align-center">
        <h2>Cook and Enjoy</h2>
        <p>
          Enjoy your new recipe and the process of cooking with RecipeVision. We are here to help
          you make the most of your pantry and make it easier to cook with friends and family.
        </p>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
  h2,
  h1 {
    color: #0091ea;
  }
  #steps {
    height: 200px;
    width: 90%;
    padding-bottom: 0;
  }
  #info-text {
    font-size: 1.25em;
    line-height: 1.5;
    max-width: 800px;
    padding-left: 3rem;
    padding-right: 3rem;
    text-align: center;
  }
  #text-box {
    width: 300px;
    height: 200px;
    text-align: center;
  }
  @media (max-width: 1000px) {
    #steps {
      flex-direction: column;
      font-size: 1.25em;
      line-height: 1.5;
      text-align: center;
      height: 600px;
      justify-content: center;
      align-items: center;
    }
    #text-box {
      padding-left: 0;
      padding-right: 0;
      height: 240px;
      width: 90%;
    }
  }
  @media (max-width: 375px) {
    #steps {
      height: 700px;
    }
    #text-box {
      height: 300px;
    }
  }
</style>
