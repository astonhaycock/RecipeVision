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
        nav_open: false,
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
    <div id="nav-small">
      <div>
        <img id="big-logo" src="@/assets/logo.png" />
        <button @click="nav_open = !nav_open">&#9776;</button>
      </div>
      <div class="links" v-if="nav_open === true">
        <div class="links" @click="nav_open = false">
          <RouterLink class="link" to="/">Home</RouterLink>
          <RouterLink class="link" to="/about">About</RouterLink>
          <RouterLink class="link" to="/ingredients">Ingredients</RouterLink>
        </div>
        <!-- Check login with current_user, imported in the setup() block above -->
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
    </div>

    <div id="nav-big">
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

  <RouterView v-if="nav_open === false" />
</template>

<style scoped>
  v-app {
    width: 100%;
  }
  #nav-big {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20rem;
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

  @media (max-width: 1200px) {
    #nav-small {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    #nav-small .links {
      width: 100%;

      display: flex;
      align-items: center;
    }
    #nav-small .links .link {
      border: solid 1px white;
      text-align: center;
      width: 200px;
    }
    nav button {
      font-size: xx-large;
    }
    #nav-big {
      gap: 0;
      display: none;
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
