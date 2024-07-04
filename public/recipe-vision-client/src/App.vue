<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/ingredients">Ingredients</RouterLink>
    <RouterLink to="/">Login/Register</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped></style>
