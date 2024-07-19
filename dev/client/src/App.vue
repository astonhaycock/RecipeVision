<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { onMounted } from "vue";
// import HelloWorld from "./components/HelloWorld.vue";
import NavBar from "./components/NavBar.vue";
import NavBarMobile from "./components/NavBarSmall.vue";
import FoodView from "./views/FoodView.vue";

// `inject` is used for importing the global session data
import { inject, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const login = ref(false);
const nav_open = ref(false);
const current_user: { email: string; IngredientList: string } = inject(
  "current_user"
) || {
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

  const response = await fetch(
    `${import.meta.env.VITE_PUBLIC_URL}:${
      import.meta.env.VITE_PUBLIC_PORT
    }/api/session`,
    {
      credentials: "include",
      method: "GET",
      headers: myHeaders,
    }
  );

  if (response.status === 200) {
    login.value = true;
  } else {
    login.value = false;
  }
}
async function logout() {
  const myHeaders = new Headers();
  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
  };

  const response = await fetch(
    `${import.meta.env.VITE_PUBLIC_URL}:${
      import.meta.env.VITE_PUBLIC_PORT
    }/api/session`,
    requestOptions
  );
  if (response.status === 200 || response.status == 401) {
    router.push("/auth");
    login.value = false;
  } else {
    login.value = true;
  }
}
onMounted(() => {
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
  <v-app id="inspire">
    <NavBar id="nav" v-model:login="login" @logout="logout" />
    <RouterView @login="getSession()" />
    <!-- <FoodView /> -->
  </v-app>
</template>
