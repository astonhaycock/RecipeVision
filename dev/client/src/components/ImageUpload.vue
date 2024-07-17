<script setup lang="ts">
  import { ref } from "vue";
  import icon from "./icons/IconUpload.vue";
  import cameraIcon from "./icons/cameraIcon.vue";
  import ReviewList from "./ReviewList.vue";

  const emit = defineEmits(["reviewIngredients", "modal"]);

  const URL = "https://dont-pani.cc/api/image";
  const ReviewListIngredients = ref<string>("");
  const image = ref<File | null>(null);
  const imageUrl = ref<string | null>(null);
  const loading = ref(false);
  const IngredientReview = ref<string | null>(null);

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] || null;
    if (file) {
      image.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          imageUrl.value = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    loading.value = true;
    if (image.value) {
      const formData = new FormData();
      formData.append("image", image.value);

      const requestOptions = {
        method: "POST",
        body: formData,
      };
      const response = await fetch(URL, requestOptions);
      const data = await response.json();
      // Emitting event to parent component with the uploaded image data
      IngredientReview.value = data;
      // Assumes you are listening to this event in the parent component
      loading.value = false;
      imageUrl.value = null;
    }
  };
  const clearImage = () => {
    imageUrl.value = null;
  };
</script>

<template>
  <div id="container">
    <div id="title">
      <h1>Ingredients</h1>
      <form @submit.prevent>
        <input type="file" id="actual-btn" @change="handleFileUpload" hidden />
        <!-- change later with better icon -->
        <label for="actual-btn"><img src="@/assets/imageUpload.png" alt="" /></label>
      </form>
    </div>

    <div v-if="imageUrl" id="image">
      <v-img :width="220" aspect-ratio="16/9" cover :src="imageUrl"></v-img>
      <div v-if="!loading">
        <v-btn class="d-flex flex-grow-1" @click="clearImage()">Discard</v-btn>
        <v-btn class="d-flex flex-grow-1" @click="uploadImage()">Upload</v-btn>
      </div>
      <div id="loading-bar" v-else>
        <v-progress-linear id="bar" :indeterminate="true"></v-progress-linear>
      </div>
    </div>
  </div>
  <review-list v-model:review-list="IngredientReview" />
</template>

<style scoped>
  #loading-bar {
    width: 90%;
    /* padding: 0.2rem; */
  }
  #bar {
    padding: 0.2rem;
  }
  #container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  #title {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 1rem;
  }
  #image {
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  #image div {
    display: flex;
    gap: 2rem;
  }
</style>
