<script lang="ts">
  import { RouterLink, RouterView } from "vue-router";
  import { defineComponent, inject, ref } from "vue";
  const login = ref(true);
  const message = ref("Hello, World!");
  const nav_open = ref(false);
  const current_user = ref(false);

  export default defineComponent({
    data() {
      return {
        login: true,
        message: "Hello, World!",
        nav_open: false,
        current_user: false,
      };
    },
  });
</script>

<template>
  <nav>
    <div id="nav-big">
      <img id="small-logo" src="@/assets/logo.png" />
      <div>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/recipe">Recipes</RouterLink>
        <RouterLink to="/ingredients">Ingredients</RouterLink>
      </div>
      <!-- Check login with current_user, imported in the setup() block above -->
      <RouterLink v-if="current_user" to="/logout">Logout</RouterLink>
      <RouterLink v-else to="/Auth">Login</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
  #nav-big {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* gap: 20rem; */
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .links {
    display: flex;
    /* background-color: aliceblue; */
    flex-direction: column;
  }
  #nav-small {
    display: none;
  }
  #links-small {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #small-logo {
    display: block;
  }
  #big-logo {
    display: none;
  }

  @media (max-width: 900px) {
    nav button {
      font-size: xx-large;
    }
    #big-logo {
      display: block;
    }
    nav {
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }
  }
</style>
