<script setup lang="ts">
//! We need a comment right here because otherwise stuff breaks.
// Idk I'm not a frontend genius.
</script>
<script lang="ts">
import icon from "./icons/IconUpload.vue";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      image: null,
    };
  },
  methods: {
    handleFileUpload: function (event) {
      console.log(event.target.files);
      this.image = event.target.files[0];
    },
    uploadImage: async function () {
      const formData = new FormData();
      formData.append("image", this.image);

      let requestOptions = {
        method: "POST",
        body: formData,
      };

      let response = await fetch(
        "http://dogsmeow.asuscomm.com:8080/api/image",
        requestOptions
      );
      const data = await response.json();
      console.log(data);
    },
  },
});
</script>

<template>
  <div id="img-container">
    <h2>Upload Photo of Ingredients</h2>
    <div id="img-box">
      <icon />
      <form @submit.prevent="uploadImage()">
        <input type="file" id="actual-btn" @change="handleFileUpload" hidden />
        <label for="actual-btn">Choose File</label>
        <button type="submit" @click="uploadImage()">Upload Ingredients</button>
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
}
#img-box svg {
  width: 500px;
  height: auto;
  /* color: var(--vt-c-white-mute); */
}
#img-box div {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
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
