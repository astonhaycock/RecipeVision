<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { onBeforeMount, type Ref } from "vue";
// import HelloWorld from "./components/HelloWorld.vue";
import NavBar from "./components/NavBar.vue";

// `inject` is used for importing the global session data
import { inject, ref } from "vue";
const login = ref(false);
const nav_open = ref(false);
const router = useRouter();
const current_user: { email: string; IngredientList: string } = inject(
  "current_user"
) || {
  email: "error",
  IngredientList: "error",
};
const mobile = inject("mobile") as Ref<boolean>;

function handleNavOpen() {
  nav_open.value = true;
}
function receiveUser(user: any) {
  console.log(user);
}
async function getSession() {
  const myHeaders = new Headers();

  const response = await fetch(
    `${import.meta.env.VITE_PUBLIC_URL}/api/session`,
    {
      credentials: "same-origin",
      method: "GET",
      headers: myHeaders,
    }
  );

  if (response.status === 200) {
    router.push("/food");
    login.value = true;
  } else {
    router.push("/home");
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

  const response = await fetch(
    `${import.meta.env.VITE_PUBLIC_URL}/api/session`,
    requestOptions
  );
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

<style scoped></style>

<template>
  <v-app
    id="inspire"
    class="d-flex bg-grey-lighten-4"
    :class="mobile ? 'pt-4 mb-16' : 'pt-0'"
  >
    <NavBar id="nav" v-model:login="login" @logout="logout" />
    <RouterView @login="getSession()" />
    <!-- <FoodView /> -->
  </v-app>
</template>
