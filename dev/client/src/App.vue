<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";

// `inject` is used for importing the global session data
import { defineComponent, inject } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    // Import the global-level 'current-user' to track session info
    const current_user = inject("current_user");
    return { current_user };
  },
  data() {
    return {
      login: true,
      message: "Hello, World!",
    };
  },
  methods: {
    async loginUser() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.user),
      };

      const response = await fetch(`${URL}/session`, requestOptions);
      const data = await response.json();

      if (response.status === 201) {
        console.log("Successfully logged in");
        this.currentUser = data; // Assign fetched user data
        this.user = { name: "", email: "", password: "" }; // Clear user form data
        this.currentPage = "quizzes";
      } else {
        console.log("Failed to login");
      }
    },
    async registerUser() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.user),
      };

      const response = await fetch(`${URL}/users`, requestOptions);

      if (response.status === 201) {
        console.log("Successfully registered");
        await this.loginUser();
      } else {
        console.log("Failed to register");
      }
    },
    async getSession() {
      const response = await fetch(`${URL}/session`);
      if (response.status === 200) {
        const data = await response.json();
        this.currentUser = data;
        this.currentPage = "quizzes";
      } else {
        this.currentPage = "login";
      }
    },
    async deleteSessions() {
      const requestOptions = {
        method: "DELETE",
      };
      const response = await fetch(`${URL}/session`, requestOptions);
      if (response.status === 204) {
        this.currentUser = null;
        this.currentPage = "login";
      }
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
    <div id="links">
      <img id="small-logo" src="@/assets/logo.png" />
      <div>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/ingredients">Ingredients</RouterLink>
      </div>
      <!-- Check login with current_user, imported in the setup() block above -->
      <RouterLink v-if="current_user.username !== ''" to="/logout"
        >Logout</RouterLink
      >
      <RouterLink v-else to="/login">Login</RouterLink>
    </div>
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
