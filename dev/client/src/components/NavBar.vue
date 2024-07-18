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
  <v-app-bar color="grey-lighten-4" height="100" :elevation="10">
    <RouterLink to="/"
      ><v-btn
        class="me-2"
        color="grey-lighten-4"
        height="90"
        variant="flat"
        width="120"
        >Home</v-btn
      ></RouterLink
    >
    <RouterLink v-if="current_user" to="/food">
      <v-btn
        class="me-2"
        color="grey-lighten-4"
        height="90"
        variant="flat"
        width="120"
      >
        Food</v-btn
      ></RouterLink
    >
    <v-app-bar-title>
      <RouterLink v-if="!current_user" to="/auth" class="float-right">
        <v-btn
          class="me-2"
          color="grey-lighten-4"
          height="90"
          variant="flat"
          width="120"
        >
          Login</v-btn
        ></RouterLink
      >

      <v-btn
        v-else
        msg="Logout"
        @click="$emit('logout')"
        class="me-2 float-right"
        color="grey-lighten-4"
        height="90"
        variant="flat"
        width="120"
      >
        Logout</v-btn
      >
    </v-app-bar-title>
  </v-app-bar>
</template>

<style scoped></style>
