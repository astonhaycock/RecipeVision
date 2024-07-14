<script lang="ts">
  import { RouterLink, RouterView } from "vue-router";
  import { defineComponent, inject } from "vue";

  export default defineComponent({
    data() {
      return {
        login: true,
        message: "Hello, World!",
        nav_open: false,
        current_user: false,
        nav: "nav_open",
      };
    },
  });
</script>

<template>
  <nav>
    <div class="nav-small">
      <div id="icon">
        <button id="nav_button" @click="nav_open = !nav_open">&#9776;</button>
        <h1>Recipe Vision</h1>
        <img id="big-logo" src="@/assets/logo.png" />
      </div>

      <div
        class="links-container"
        v-if="nav_open === true"
        :class="{ nav: nav_open }"
      >
        <div class="links" @click="nav_open = false">
          <div id="icon">
            <button id="nav_button" @click="nav_open = !nav_open">
              &#9776;
            </button>
            <h1>Recipe Vision</h1>
            <img id="big-logo" src="@/assets/logo.png" />
          </div>
          <RouterLink class="link" to="/">Home</RouterLink>
          <RouterLink class="link" to="/about">About</RouterLink>
          <RouterLink class="link" to="/ingredients">Ingredients</RouterLink>
          <RouterLink
            class="link"
            @click="nav_open = false"
            v-if="current_user"
            to="/logout"
            >Logout</RouterLink
          >
          <RouterLink class="link" @click="nav_open = false" v-else to="/login"
            >Login</RouterLink
          >
        </div>
        <!-- Check login with current_user, imported in the setup() block above -->
      </div>
    </div>
  </nav>
</template>

<style scoped>
  #nav_button {
    padding-left: 4rem;
    font-size: 3rem;
  }
  #icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  #icon h1 {
    padding-left: 2rem;
  }
  .links {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .link {
    width: 50%;
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
  .nav-small {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    /* padding-left: 2rem; */
    width: 100%;
    top: 0;
    left: 0;
  }
  .nav {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.732);
    height: 100vh;
    width: 100%;
    justify-content: space-between;
    /* padding-top: 9rem; */
    /* padding-left: 2rem; */
    /* top: 0;
    left: 0; */
  }
  nav button {
    font-size: xx-large;
  }
  #big-logo {
    display: block;
  }

  .link:hover {
    background-color: rgba(200, 200, 200, 0.219);
  }
</style>
