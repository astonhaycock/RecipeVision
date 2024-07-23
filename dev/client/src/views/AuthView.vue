<script setup lang="ts">
import { defineComponent, defineEmits, ref } from "vue";
import login from "../components/Login.vue";
import register from "../components/Register.vue";
import Recipe from "../components/recipes/Recipe.vue";
import DefaultButton from "../components/DefaultButton.vue";
const emit = defineEmits(["login", "register"]);
const page = ref("login");
function pageChange(pageSelected: string) {
  page.value = pageSelected;
}
function loginF() {
  emit("login");
}
function registerPage() {
  page.value = "register";
}
function loginPage() {
  page.value = "login";
}
function demoLogin() {
  fetch(`${URL}/api/demo`, {
    method: "POST",
    credentials: "same-origin",
  });
}
</script>

<template>
  <div id="page">
    <login
      v-if="page === 'login'"
      @login="loginF"
      @registerPage="registerPage"
      @demo-login="demoLogin"
    />
    <register
      v-if="page === 'register'"
      @login="loginF"
      @loginPage="loginPage"
      @demo-login="demoLogin"
    />
  </div>
</template>

<style>
#page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
