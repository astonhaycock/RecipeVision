<script setup lang="ts">
import { defineComponent, defineEmits, ref } from "vue";
import login from "../components/Login.vue";
import register from "../components/Register.vue";
import Recipe from "../components/recipes/Recipe.vue";
import DefaultButton from "../components/DefaultButton.vue";
import router from "@/router";
const emit = defineEmits(["login", "register"]);
const page = ref("login");

const URL = import.meta.env.VITE_PUBLIC_URL;

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
async function demoLogin() {
  const response = await fetch(`${URL}/api/demo_auth`, {
    method: "POST",
    credentials: "same-origin",
  });
  if (response.status === 201) {
    console.log("Successfully logged in");
    router.push("/");
    emit("login");
  } else {
    console.log("Failed to login");
  }
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
