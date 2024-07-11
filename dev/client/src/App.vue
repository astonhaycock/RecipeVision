<script lang="ts">
  import { RouterLink, RouterView } from "vue-router";
  import HelloWorld from "./components/HelloWorld.vue";

  // `inject` is used for importing the global session data
  import { defineComponent, inject } from "vue";

  export default defineComponent({
    name: "App",
    setup() {
      // Import the global-level 'current-user' to track session info
      const current_user: { email: string; IngredientList: string } = inject(
        "current_user"
      ) || { email: "error", IngredientList: "error" };
      return { current_user };
    },
    data() {
      return {
        login: true,
        message: "Hello, World!",
      };
    },
    methods: {
      receiveUser(user: any) {
        console.log(user);
      },
      async getSession() {
        const response = await fetch(
          "http://dogsmeow.asuscomm.com:8080/api/session"
        );
        if (response.status === 200 && (await response.json()) !== "") {
          const data = await response.json();
          this.current_user.email = data.email;
          this.current_user.IngredientList = data.ingredient;
        } else {
          this.current_user.email = "error";
          this.current_user.IngredientList = "error";
        }
        console.log(this.current_user);
      },
    },
    created() {
      this.getSession();
    },
  });
</script>

<template>
  <nav>
    <img id="big-logo" src="@/assets/logo.png" />
    <div id="links">
      <img id="small-logo" src="@/assets/logo.png" />
      <div>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/ingredients">Ingredients</RouterLink>
      </div>
      <!-- Check login with current_user, imported in the setup() block above -->
      <RouterLink v-if="current_user" to="/logout">Logout</RouterLink>
      <RouterLink v-else to="/login">Login</RouterLink>
    </div>
  </nav>
  <RouterView />
</template>

<style scoped>
  v-app {
    width: 100%;
  }
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
