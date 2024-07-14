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
        ingredients: [],
      };
    },
    methods: {},
    computed: {},
  });
</script>

<template>
  <div id="list-container">
    <h2>List of Ingredients</h2>
    <input type="text" placeholder="search IngredientList" />
    <div id="list">
      <div id="ingredient">
        <p>salt</p>
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
    /* overflow: hidden; */
    overflow-y: scroll;
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
    flex-direction: row;
    gap: 0.5rem;
    list-style-type: none;
    padding: 0;
    margin: 0;
    align-items: center;
    justify-content: center;
  }
  #ingredient {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
    align-items: center;
    flex-direction: row;
  }
  #ingredient p {
    width: 12rem;
    overflow-wrap: break-word;
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
