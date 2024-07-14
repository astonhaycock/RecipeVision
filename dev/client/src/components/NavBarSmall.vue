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
      <div id="icon" v-if="!nav_open">
        <img id="big-logo" src="@/assets/logo.png" />
        <button id="nav_button" @click="nav_open = !nav_open">&#9776;</button>
      </div>
      <div v-if="nav_open" id="spacer"></div>

      <div
        class="links-container"
        v-if="nav_open === true"
        :class="{ nav: nav_open }"
      >
        <div class="links" @click="nav_open = false">
          <div id="icon">
            <img id="big-logo" src="@/assets/logo.png" />
            <button id="nav_button" @click="nav_open = !nav_open">
              &#9776;
            </button>
          </div>
          <RouterLink class="link" to="/">Home</RouterLink>
          <RouterLink class="link" to="/recipe">Recipes</RouterLink>
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
  #spacer {
    padding-top: 9.4rem;
  }
  #nav_button {
    padding-left: 2rem;
    font-size: 3rem;
    justify-content: space-around;
  }
  #icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 3rem;
    padding-left: 3rem;
  }
  .links {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .link {
    width: 100%;
    /* float: right; */
    padding-left: 45%;
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

  #big-logo {
    display: block;
  }

  .link:hover {
    background-color: rgba(146, 145, 145, 0.602);
  }
</style>
