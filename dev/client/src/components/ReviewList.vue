<script setup lang="ts">
defineProps<{
  reviewList: string;
}>();
</script>
<script lang="ts">
import icon from "./icons/IconUpload.vue";
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {};
  },
  methods: {},
  computed: {},
});
</script>

<template>
  <div id="list-container">
    <h2>List of Ingredients</h2>
    <ul>
      <li id="ingredient" v-for="ingredient in reviewList">
        <p id="ingredient">{{ ingredient }}</p>
        <button id="editBtn">Edit</button>
        <button id="deleteBtn">Delete</button>
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
