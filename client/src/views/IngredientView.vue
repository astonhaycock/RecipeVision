<script setup lang="ts">
import IngredientList from "../components/IngredientList.vue";
import ImageUpload from "../components/ImageUpload.vue";
</script>

<template>
  <div class="UploadImage"></div>
  <div id="page">
    <ImageUpload />
    <IngredientList />
  </div>
</template>

<style scoped>
#page {
  padding-top: 2rem;
  display: flex;
  width: 80%;
  justify-content: space-around;
}
@media (max-width: 1200px) {
  #page {
    flex-direction: column;
  }
}
</style>
