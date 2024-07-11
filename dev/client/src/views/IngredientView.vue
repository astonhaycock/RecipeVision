<script setup lang="ts">
  import loading from "../assets/loading.gif";
  import IngredientList from "../components/IngredientList.vue";
  import ImageUpload from "../components/ImageUpload.vue";
  import ReviewList from "../components/ReviewList.vue";
  import { defineComponent } from "vue";
  import { ref, type Ref } from "vue";

  const ingredients: Ref<string[]> = ref([]);
  const ingredient = ref("#4400ff");
</script>

<script lang="ts">
  export default defineComponent({
    components: {
      ImageUpload,
    },
    data() {
      return {
        modal: false,
        loadingscreen: true,
        reviewList: "",
      };
    },
    methods: {
      handleReviewIngredients: function (data: string) {
        this.reviewList = data;
        this.loadingscreen = false;
      },
    },
    computed: {},
  });
</script>

<template>
  <div class="UploadImage"></div>
  <div id="page" v-bind:class="[modal ? 'open' : 'close']">
    <ImageUpload
      v-on:modal="modal = true"
      @reviewIngredients="handleReviewIngredients"
    />
    <IngredientList />
  </div>
  <div v-if="modal" class="modal">
    <div class="modal-content">
      <div v-if="!loadingscreen">
        <ReviewList v-bind:reviewList="reviewList" />
        <button class="updateBtn" @click="modal = false">
          Save ingredients
        </button>
        <button class="updateBtn" @click="modal = false">
          Save ingredients
        </button>
      </div>
      <div id="loading-screen" v-else>
        <h3>Loading Ingredients</h3>
        <img src="@/assets/loading.gif" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  #page {
    padding-top: 1rem;
    display: flex;
    width: 80%;
    justify-content: space-around;
  }
  #loading-screen {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
  #loading-screen img {
    width: 250px;
    height: 250px;
  }
  .modal {
    height: 100vh;
    background-color: rgba(24, 21, 21, 0.88);
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10rem;
    gap: 1rem;
    height: 100vh;
    color: white;
    text-align: center;
    font-size: larger;
  }
  .modal-content input {
    text-align: center;
  }
  .open {
    filter: blur(18px);
    overflow: hidden;
  }

  @media (max-width: 1200px) {
    #page {
      flex-direction: column;
    }
  }
</style>
