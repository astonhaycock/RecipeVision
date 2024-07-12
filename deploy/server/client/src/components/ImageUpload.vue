<script setup lang="ts">
  import { defineComponent, inject } from "vue";
  import icon from "./icons/IconUpload.vue";
  import cameraIcon from "./icons/cameraIcon.vue";
  import ReviewList from "./ReviewList.vue";
  let URL = "http://dogsmeow.asuscomm.com:8080/api/image";
  const modal = defineModel({ default: false });
</script>
<script lang="ts">
  export default defineComponent({
    data() {
      return {
        modal: false,
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
  <div id="mobile">
    <div id="addIcon">
      <form @submit.prevent>
        <input type="file" id="actual-btn" @change="handleFileUpload" hidden />
        <label
          id="mobile-label"
          type="submit"
          for="actual-btn"
          @click="modal = true"
          ><cameraIcon
        /></label>
      </form>
    </div>
    <div v-if="modal" class="modal">
      <div class="modal-content">
        <img v-if="image" id="userImage" :src="imageUrl" />
        <div id="mobile-btn">
          <button
            @click="
              uploadImage();
              $emit('modal');
              modal = false;
              imageURl = null;
            "
          >
            Upload
          </button>
          <button
            @click="
              modal = false;
              imageURl = null;
            "
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #mobile-btn {
    display: flex;
    gap: 1rem;
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
  #mobile {
    display: none;
  }
  #mobile-label {
    display: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #addIcon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: rgb(0, 179, 255);
  }
  #addIcon:hover {
    background-color: rgba(0, 179, 255, 0.599);
  }
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
    /* background-color: var(--vt-c-divider-dark-2); */
    /* color: var(--vt-c-text-dark-2); */
    /* color: var(--vt-c-white-mute); */
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
    #mobile {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    /* #mobile input {
      width: 10rem;
      height: 3rem;
    } */

    form {
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }
    #img-container {
      /* border: white solid; */
      display: none;
      /* background-color: var(--vt-c-divider-dark-2);
      color: var(--vt-c-white-mute); */
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
      background-color: none;
      /* color: var(--vt-c-text-dark-2); */
      color: none;
      transition: 400ms;
    }
    label {
      /* padding: 2rem; */
    }
    #movbile-label {
    }
  }
</style>
