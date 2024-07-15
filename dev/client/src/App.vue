<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
// import HelloWorld from "./components/HelloWorld.vue";
import NavBar from "./components/NavBar.vue";
import NavBarMobile from "./components/NavBarSmall.vue";

// `inject` is used for importing the global session data
import { defineComponent, inject } from "vue";

export default defineComponent({
  components: {
    NavBar,
    NavBarMobile,
  },
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
    handleNavOpen: function () {
      this.nav_open = true;
    },
    receiveUser(user: any) {
      console.log(user);
    },

    async getSession() {
      const response = await fetch("https://dont-pani.ccani.cc/api/session");
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
    created() {
      this.getSession();
    },
  });
</script>

<template>
  <NavBar id="bigNav" />
  <NavBarMobile id="mobileNav" @nav_open="handleNavOpen()" />
  <RouterView v-if="nav_open === false" />
</template>

<style scoped>
#mobileNav {
  display: none;
}
#bigNav {
  display: block;
}

@media (max-width: 900px) {
  #mobileNav {
    display: block;
  }
  #bigNav {
    display: none;
  }
}
</style>
