<script setup lang="ts">
  import loading from "../assets/loading.gif";
  import IngredientList from "../components/IngredientList.vue";
  import ImageUpload from "../components/ImageUpload.vue";
  import ReviewList from "../components/ReviewList.vue";
  import RecipeList from "../components/Recipe.vue";
  import { defineComponent } from "vue";
  import { ref, type Ref } from "vue";
  import DefaultButton from "../components/DefaultButton.vue";
  const URL = "https://dont-pani.cc";

  const ingredients: Ref<string[]> = ref([]);
  const ingredient = ref("#4400ff");
  const modal = ref(false);
  const loading_screen = ref(true);
  const reviewList: Ref<string[]> = ref([]);

  function handleReviewIngredients(data: string[]) {
    reviewList.value = data;
    loading_screen.value = false;
  }
  async function sendIngredients(reviewList: Array<string>) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const data = { ingredients: reviewList };

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(data),
    };
    const response = await fetch(`${URL}/api/ingredients`, requestOptions);
    if (response.status === 204) {
      console.log("Successfully added ingredient");
    } else {
      console.log("Failed to add ingredient");
    }
  }
</script>

<template>
  <!-- <div class="UploadImage"></div>
  <div id="page" v-bind:class="[modal ? 'open' : 'close']">
    <ImageUpload v-on:modal="modal = true" @reviewIngredients="handleReviewIngredients" />
    <IngredientList />
  </div>
  <div v-if="modal" class="modal">
    <div class="modal-content">
      <div v-if="!loading_screen">
        <h1>Review List</h1>
        <ReviewList v-model:reviewList="reviewList" />
        <div id="reviewBtn">
          <DefaultButton class="btn" @click="modal = false" msg="Discard" />
          <DefaultButton class="btn" @click="(modal = false), sendIngredients(reviewList)" msg="Save List" />
        </div>
      </div>
      <div id="loading-screen" v-else>
        <h3>Loading Ingredients</h3>
        <img src="@/assets/loading.gif" />
      </div>
    </div>
  </div> -->
  <!-- <ImageUpload /> -->
  <IngredientList />
  <RecipeList />
</template>

<style scoped></style>
