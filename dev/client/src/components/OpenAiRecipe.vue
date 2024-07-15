<script setup lang="ts">
import { defineComponent } from "vue";
import DefaultButton from "../components/DefaultButton.vue";
import { ref } from "vue";
import icon from "./icons/IconUpload.vue";
import cameraIcon from "./icons/cameraIcon.vue";
import ReviewList from "./ReviewList.vue";

const URL = "https://dont-pani.ccani.cc/api/recipe";
const modal = ref(false);
const ReviewListIngredients = ref<string>("");
const image = ref<File | null>(null);
const imageUrl = ref<string | null>(null);

const uploadImage = async () => {
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
    // Assumes you are listening to this event in the parent component
    modal.value = false;
    imageUrl.value = null;
  }
};
</script>
<script lang="ts">
export default defineComponent({
  data() {
    return {};
  },
  methods: {},
  computed: {},
});
</script>
<template>
  <div id="page">
    <div class="login-page">
      <DefaultButton id="getBtn" msg="Generate new recipe" />
    </div>
  </div>
</template>

<style scoped>
#page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#getBtn {
  width: 150px;
  height: 70px;
  font-size: large;
}
</style>
