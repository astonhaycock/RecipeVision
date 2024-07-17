<script setup lang="ts"></script>
<script lang="ts">
  import icon from "./icons/IconUpload.vue";
  import DefaultButton from "./DefaultButton.vue";
  import { defineComponent } from "vue";

  export default defineComponent({
    components: {
      DefaultButton,
    },
    data() {
      return {
        ingredients: [
          "salt",
          "pepper",
          "garlic powder",
          "salt",
          "pepper",
          "garlic powder",
          "salt",
          "pepper",
          "garlic powder ",
          "salt",
          "pepper",
          "garlic powder",
        ],
      };
    },
    methods: {},
    computed: {},
  });
</script>

<template>
  <div id="list-container">
    <input type="text" placeholder="search Ingredients" />
    <div id="list">
      <div id="ingredient" v-for="ingredient in ingredients">
        <p>{{ ingredient }}</p>
        <DefaultButton msg="Edit" />
        <DefaultButton msg="Delete" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  input {
    background-color: white;
    width: 20rem;
    height: 3rem;
    border-radius: 9px;
  }
  #list-container {
    /* color: var(--vt-c-white-mute); */
    height: 100%;
    width: 100%;
    font-size: larger;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    /* justify-content: center; */
  }
  #list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style-type: none;
    padding: 0;
    margin: 0;
    align-items: center;
    justify-content: flex-start;
    gap: 2rem;
    height: 550px;
    overflow: hidden;
    overflow-y: scroll;
  }
  #ingredient {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
    align-items: center;
    flex-direction: row;
    padding: 1rem;
  }
  #ingredient:nth-child(odd) {
    background-color: rgba(175, 175, 175, 0.225);
  }
  #ingredient p {
    width: 12rem;
    overflow-wrap: break-word;
    text-align: left;
  }

  @media (max-width: 1200px) {
    input {
      background-color: white;
      width: 15rem;
      height: 3rem;
      border-radius: 9px;
    }
    #ingredient p {
      width: 10rem;
      overflow-wrap: break-word;
    }
  }
</style>
