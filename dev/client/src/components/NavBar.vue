<script setup lang="ts">
  import { RouterLink, RouterView } from "vue-router";
  import { defineComponent, inject, ref, defineModel } from "vue";
  import type { ModelRef, PropType, Ref } from "vue";
  import DefaultButton from "./DefaultButton.vue";
  const emit = defineEmits(["logout"]);

  // const current_user = defineModel<{
  //   login: boolean;
  // }>();
  const current_user = defineModel("login") as ModelRef<string>;

  // const login = ref(false);
  const message = ref("Hello, World!");
  const nav_open = ref(false);
  // const current_user = ref(false);
</script>

<template>
  <v-app-bar color="grey-lighten-4" height="100" class="d-flex justify-center" :elevation="10">
    <div id="NavBar">
      <RouterLink to="/"
        ><v-btn class="me-2" color="grey" height="40" variant="flat" width="80"
          >Home</v-btn
        ></RouterLink
      >

      <RouterLink v-if="current_user" to="/recipe"
        ><v-btn class="me-2" color="grey" height="40" variant="flat" width="100"
          >Recipes</v-btn
        ></RouterLink
      >

      <RouterLink v-if="current_user" to="/ingredients">
        <v-btn class="me-2" color="grey" height="40" variant="flat" width="120">
          Ingredients</v-btn
        ></RouterLink
      >

      <RouterLink v-if="!current_user" to="/Auth">
        <v-btn class="me-2" color="grey" height="40" variant="flat" width="120">
          Login</v-btn
        ></RouterLink
      >

      <v-btn
        v-else
        msg="Logout"
        @click="$emit('logout')"
        class="me-2"
        color="grey"
        height="40"
        variant="flat"
        width="120">
        Logout</v-btn
      >
    </div>
  </v-app-bar>
  <!-- <v-footer color="grey" height="44" app></v-footer> -->
</template>

<style scoped>
  #navBar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100vw;
  }
</style>
