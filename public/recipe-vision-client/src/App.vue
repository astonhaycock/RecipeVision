<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  data() {
    return {
      login: true,
      message: "Hello, World!",
    };
  },
  methods: {
    updateMessage(): void {
      this.message = "You clicked the button!";
    },
  },
  created() {
    console.log("app running");
  },
});
</script>

<template>
  <nav>
    <img id="big-logo" src="@/assets/logo.png" />
    <div id="links" v-if="login">
      <img id="small-logo" src="@/assets/logo.png" />
      <div>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/ingredients">Ingredients</RouterLink>
      </div>
      <RouterLink to="/logout">Logout</RouterLink>
    </div>

    <!-- <RouterLink to="/login" v-if="login">Login/Register</RouterLink> -->
  </nav>
  <RouterView />
</template>

<style scoped>
#links {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20rem;
}
#small-logo {
  display: block;
}
#big-logo {
  display: none;
}

@media (max-width: 1200px) {
  #links {
    gap: 0;
  }
  #small-logo {
    display: none;
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
