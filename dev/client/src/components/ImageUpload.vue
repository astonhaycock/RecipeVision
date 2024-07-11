<script setup lang="ts">
import { defineComponent, inject } from "vue";
import icon from "./icons/IconUpload.vue";
import ReviewList from "./ReviewList.vue";
let URL = "http://dogsmeow.asuscomm.com:8080/api/image";
const modal = defineModel({ default: false });
</script>
<script lang="ts">
export default defineComponent({
  data() {
    return {
      ReviewListIngredients: "",
      image: null,
      imageUrl: null,
    };
  },
  methods: {
    handleFileUpload: function (event) {
      console.log(event.target.files);
      let file = event.target.files[0];
      this.image = file;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    uploadImage: async function () {
      const formData = new FormData();
      formData.append("image", this.image);

      let requestOptions = {
        method: "POST",
        body: formData,
      };
      console.log("before fetch");
      let response = await fetch(
        "http://dogsmeow.asuscomm.com:8080/api/image",
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      this.$emit("reviewIngredients", data);
    },
  },
});
</script>

<template>
  <div id="img-container">
    <h2>Upload Photo of Ingredients</h2>
    <div id="img-box">
      <div id="img">
        <img v-if="image" id="userImage" :src="imageUrl" />
        <icon v-if="!image" />
      </div>

      <form @submit.prevent>
        <input type="file" id="actual-btn" @change="handleFileUpload" hidden />
        <label for="actual-btn">Choose File</label>
        <button
          v-if="image != null"
          type="submit"
          @click="
            uploadImage();
            $emit('modal');
          "
        >
          Upload Ingredients
        </button>
        <button v-if="image === null">No images</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
#img-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* border: white solid; */
  background-color: var(--vt-c-divider-dark-2);
  color: var(--vt-c-white-mute);
  padding: 3rem;
  padding-left: 8rem;
  padding-right: 8rem;
  gap: 2rem;
}
#img {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 400px;
}

#userImage {
  width: 80%;
  height: auto;
}
#img-box {
  display: flex;
  gap: 2rem;
  flex-direction: column;
}
#img-box div {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
}
form {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
button,
label {
  border-radius: 15px 15px 15px 15px;
  width: 150px;
  height: 60px;
  border: none;
  background-color: var(--vt-c-divider-dark-2);
  /* color: var(--vt-c-text-dark-2); */
  color: var(--vt-c-white-mute);
  transition: 400ms;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
}
button:hover,
label:hover {
  background-color: var(--vt-c-text-dark-2);
}
label {
  padding: 1rem;
}
@media (max-width: 1200px) {
  #img-container {
    /* border: white solid; */
    background-color: var(--vt-c-divider-dark-2);
    color: var(--vt-c-white-mute);
    padding: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    align-items: center;
    justify-content: flex-start;
  }
  #img-box svg {
    width: 400px;
    height: auto;
    /* color: var(--vt-c-white-mute); */
  }
  #img-box div {
    gap: 1rem;
  }
  button,
  label {
    border-radius: 15px 15px 15px 15px;
    width: 75px;
    height: 50px;
    border: none;
    background-color: var(--vt-c-divider-dark-2);
    /* color: var(--vt-c-text-dark-2); */
    color: var(--vt-c-white-mute);
    transition: 400ms;
  }
  label {
    padding: 0rem;
  }
}
</style>
