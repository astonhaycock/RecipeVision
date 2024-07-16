<script setup lang="ts">
  import { RouterLink, RouterView } from "vue-router";
  // import HelloWorld from "./components/HelloWorld.vue";
  import NavBar from "./components/NavBar.vue";
  import NavBarMobile from "./components/NavBarSmall.vue";

  // `inject` is used for importing the global session data
  import { inject, ref } from "vue";
  const login = ref(true);
  const nav_open = ref(false);
  const current_user: { email: string; IngredientList: string } = inject(
    "current_user"
  ) || { email: "error", IngredientList: "error" };

  function handleNavOpen() {
    nav_open.value = true;
  }
  function receiveUser(user: any) {
    console.log(user);
  }
  async function getSession() {
    const response = await fetch("https://dont-pani.cc/api/session");
    if (response.status === 200 && (await response.json()) !== "") {
      const data = await response.json();
      current_user.email = data.email;
      current_user.IngredientList = data.ingredient;
      login.value = true;
    } else {
      current_user.email = "error";
      current_user.IngredientList = "error";
      login.value = false;
    }
  }
  async function logout() {
    const myHeaders = new Headers();
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
    };

    const response = await fetch(
      "https://dont-pani.cc/api/logout",
      requestOptions
    );
    if (response.status === 200) {
      console.log(response.status);
      login.value = false;
    } else {
      login.value = true;
    }
  }
</script>

<template>
  <NavBar id="bigNav" v-model:login="login" @logout="logout" />
  <NavBarMobile
    id="mobileNav"
    @nav_open="handleNavOpen()"
    v-model:login="login"
    @logout="logout"
  />
  <RouterView v-if="nav_open === false" />
</template>

<style scoped>
  #mobileNav {
    display: none;
  }
  #bigNav {
    display: block;
  }

  @media (max-width: 900px) {
    #mobileNav {
      display: block;
    }
    #bigNav {
      display: none;
    }
  }
</style>
