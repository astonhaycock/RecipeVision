<script setup lang="ts">
  import { defineComponent, ref } from "vue";
  import login from "../components/Login.vue";
  import register from "../components/Register.vue";
  import Recipe from "../components/Recipe.vue";
  import DefaultButton from "../components/DefaultButton.vue";
  const page = ref("login");
  function pageChange(pageSelected: string) {
    // console.log(pageSelected);
    page.value = pageSelected;
  }
</script>

<template>
  <div id="page">
    <login v-if="page === 'login'" />
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
