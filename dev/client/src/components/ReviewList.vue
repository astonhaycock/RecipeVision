<script setup lang="ts">
  import icon from "./icons/IconUpload.vue";
  import {
    defineComponent,
    defineModel,
    onMounted,
    defineProps,
    ref,
  } from "vue";
  import type { PropType } from "vue";

  const ingredients = defineModel("reviewList");

  let editing = ref(false);

  function handleReviewIngredients(data: string) {
    loading_screen = false;
  }
  function deleteIngredient(index: number) {
    ingredients.value.splice(index, 1);
    console.log(ingredients);
  }
  function edit() {
    console.log(editing);
    editing = !editing;
  }
  onMounted(() => {});
</script>

<template>
  <div id="list-container">
    <ul>
      <li id="ingredient" v-for="(ingredient, index) in ingredients">
        <p v-if="!editing" id="ingredient">{{ ingredient }}</p>
        <input v-if="editing" :placeholder="ingredient" />
        <button v-if="!editing" id="editBtn" @click="edit()">Edit</button>
        <button v-if="editing" id="editBtn" @click="edit()">Save</button>
        <button id="deleteBtn" @click="deleteIngredient(index)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  #list-container {
    /* color: var(--vt-c-white-mute); */
    height: 600px;
    width: 400px;
    /* overflow: hidden; */
    overflow-y: scroll;
    font-size: larger;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  p {
    text-transform: capitalize;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  li {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
  }
  #ingredient {
    width: 25rem;
    overflow-wrap: break-word;
  }
  li button {
    border-radius: 15px 15px 15px 15px;
    width: 70px;
    border: none;
    background-color: var(--vt-c-divider-dark-2);
    color: var(--vt-c-text-dark-2);
    transition: 400ms;
  }
  #editBtn:hover {
    background-color: var(--vt-c-text-dark-2);
  }
  #deleteBtn {
    background-color: var(--vt-c-delete-red);
  }
  #deleteBtn:hover {
    background-color: var(--vt-c-delete-hover);
  }
</style>
