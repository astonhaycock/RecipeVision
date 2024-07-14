<script setup lang="ts">
  import { defineComponent } from "vue";
  import DefaultButton from "../components/DefaultButton.vue";
  import OpenAiRecipe from "../components/OpenAiRecipe.vue";
  import Recipe from "../components/Recipe.vue";
</script>

<template>
  <div id="page">
    <OpenAiRecipe />
    <Recipe />
  </div>
</template>

<style>
  #page {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 90%;
  }
  #getBtn {
    width: 150px;
    height: 70px;
    font-size: large;
  }
</style>
