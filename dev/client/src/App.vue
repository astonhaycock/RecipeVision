<script setup lang="ts">
  import { RouterLink, RouterView, useRouter } from "vue-router";
  import { onMounted, onBeforeMount } from "vue";
  // import HelloWorld from "./components/HelloWorld.vue";
  import NavBar from "./components/NavBar.vue";
  import { useMediaQuery } from "@vueuse/core";
  const mobile = useMediaQuery("(max-width: 800px)") && useMediaQuery("(max-aspect-ratio: 5/8)");

  // `inject` is used for importing the global session data
  import { inject, ref } from "vue";
  const login = ref(false);
  const nav_open = ref(false);
  const router = useRouter();
  const current_user: { email: string; IngredientList: string } = inject("current_user") || {
    email: "error",
    IngredientList: "error",
  };

  function handleNavOpen() {
    nav_open.value = true;
  }
  function receiveUser(user: any) {
    console.log(user);
  }
  async function getSession() {
    const myHeaders = new Headers();

    const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/session`, {
      credentials: "include",
      method: "GET",
      headers: myHeaders,
    });

    if (response.status === 200) {
      login.value = true;
    } else {
      router.push("/auth");
      login.value = false;
    }
  }
  async function logout() {
    router.push("/auth");
    const myHeaders = new Headers();
    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
    };

    const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/session`, requestOptions);
    if (response.status === 200 || response.status == 401) {
      login.value = false;
    } else {
      login.value = true;
    }
  }
  onBeforeMount(() => {
    getSession();
  });
</script>

<!-- <template>
  <NavBar id="bigNav" v-model:login="login" @logout="logout" />
  <NavBarMobile
    id="mobileNav"
    @nav_open="handleNavOpen()"
    v-model:login="login"
    @logout="logout"
  />
  <RouterView v-if="nav_open === false" @login="getSession()" />
</template> -->

<style scoped></style>

<template>
  <v-app id="inspire" class="d-flex bg-grey-lighten-4" :class="mobile ? 'pt-4 mb-16' : 'pt-0'">
    <NavBar id="nav" v-model:login="login" @logout="logout" />
    <RouterView @login="getSession()" />
    <!-- <FoodView /> -->
  </v-app>
</template>
