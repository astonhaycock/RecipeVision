<template>
  <nav>
    <img src="@/assets/logo.png" />
    <div v-if="login">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/ingredients">Ingredients</RouterLink>
    </div>

    <!-- <RouterLink to="/" v-if="login">Login/Register</RouterLink> -->
    <RouterLink to="/logout" v-if="login">Logout</RouterLink>
  </nav>
  <RouterView />
</template>

<script setup lang="ts"></script>

<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  data() {
    return {
      login: true,
      message: "Hello, World!",
    };
  },
  methods: {
    updateMessage(): void {
      this.message = "You clicked the button!";
    },
  },
  created() {
    console.log("app running");
  },
});
</script>

<style scoped></style>
