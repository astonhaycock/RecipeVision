<script setup lang="ts">
  import { defineComponent, defineEmits, ref } from "vue";
  import login from "../components/Login.vue";
  import register from "../components/Register.vue";
  import Recipe from "../components/Recipe.vue";
  import DefaultButton from "../components/DefaultButton.vue";
  const emit = defineEmits(["login"]);
  const page = ref("login");
  function pageChange(pageSelected: string) {
    page.value = pageSelected;
  }
  function loginF() {
    emit("login");
  }
</script>

<template>
  <div id="page">
    <login v-if="page === 'login'" @login="loginF" />
    <register v-if="page === 'register'" />
    <DefaultButton
      @click="pageChange('login')"
      msg="Login"
      v-if="page === 'register'"
    />
    <DefaultButton
      @click="pageChange('register')"
      msg="Register"
      v-if="page === 'login'"
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
