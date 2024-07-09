<script setup lang="ts">
import IngredientList from "../components/IngredientList.vue";
import ImageUpload from "../components/ImageUpload.vue";
import ReviewList from "../components/ReviewList.vue";
import { defineComponent } from "vue";
</script>
<script lang="ts">
export default defineComponent({
  data() {
    return {
      modal: false,
    };
  },
  methods: {},
  computed: {},
});
</script>

<template>
  <div class="UploadImage"></div>
  <div>
    <div id="page" v-bind:class="[modal ? 'open' : 'close']">
      <ImageUpload /> <IngredientList />
    </div>
    <div v-if="modal" class="modal">
      <div class="modal-content">
        <ReviewList />
        <button class="updateBtn" v-on:click="addExpense">
          Save ingredients
        </button>
        <button class="updateBtn" v-on:click="toggleAddModal()">
          Discard ingredients
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#page {
  padding-top: 2rem;
  display: flex;
  width: 80%;
  justify-content: space-around;
}
.modal {
  height: 100vh;
  background-color: rgba(104, 103, 103, 0.586);
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
  justify-content: center;
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
  filter: blur(8px);
}

/* .modal-open {
  display: block;
}
.modal-close {
  display: none;
} */

@media (max-width: 1200px) {
  #page {
    flex-direction: column;
  }
}
</style>
