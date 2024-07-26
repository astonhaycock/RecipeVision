<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { onBeforeMount, type Ref } from "vue";
// import HelloWorld from "./components/HelloWorld.vue";
import NavBar from "./components/NavBar.vue";
import {provide} from "vue";

const mobile = inject("mobile") as Ref<boolean>;
// `inject` is used for importing the global session data
import { inject, ref } from "vue";
import type { RecipeCollection } from "./scripts/allrecipes";
const login = ref(false);
const nav_open = ref(false);
const router = useRouter();
const ingredients = inject("ingredients") as Ref<string[]>;
const recipes = inject("recipes") as Ref<RecipeCollection>;
const recipe_ideas = inject("recipe_ideas") as Ref<string[]>;
const recipes_generated = inject("recipes_generated") as Ref<boolean>;
const populateRecipes = inject("populateRecipes") as (force: boolean) => void;
provide("logged-in", login);

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
  // check if recipes dictionary is empty
  populateRecipes(true);
  const myHeaders = new Headers();

  const response = await fetch(
    `${import.meta.env.VITE_PUBLIC_URL}/api/session`,
    {
      credentials: "include",
      method: "GET",
      headers: myHeaders,
    }
  );

  if (response.status === 200) {
    login.value = true;
  } else {
    router.push("/");
    login.value = false;
  }
}
function contact() {
  router.push("/contact");
}
async function logout() {
  router.push("/auth");
  ingredients.value = [];
  recipes.value = {};
  recipe_ideas.value = [];
  recipes_generated.value = false;
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
    login.value = true;
  } else {
    router.push("/");
    login.value = false;
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
    <NavBar
      id="nav"
      v-model:login="login"
      @logout="logout"
      @contact="contact"
    />
    <RouterView @login="getSession()" />
    <!-- <FoodView /> -->
  </v-app>
</template>
