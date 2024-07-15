<script setup lang="ts">
  import { defineComponent, inject } from "vue";
  import DefaultButton from "../components/DefaultButton.vue";
</script>
<script lang="ts">
  export default defineComponent({
    data() {
      return {
        user: {
          email: "",
          password: "",
        },
        currentUser: null,
        incorrectPassword: false,
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

        const response = await fetch(
          "https://dont-pani.cc/api/session",
          requestOptions
        );
        const data = await response.json();

        if (response.status === 201) {
          console.log("Successfully logged in");
          this.incorrectPassword = false;
          this.currentUser = data; // Assign fetched user data
          this.user = { email: "", password: "" }; // Clear user form data
        } else {
          console.log("Failed to login");
          this.incorrectPassword = true;
        }
      },
    },
    computed: {},
  });
</script>

<template>
  <div class="login-page">
    <h1>Login</h1>
    <h6 v-if="incorrectPassword">account Email/Password is incorrect</h6>
    <div>
      <input placeholder="Email" v-model="user.email" />
    </div>
    <div>
      <input placeholder="Password" v-model="user.password" />
    </div>
    <DefaultButton msg="Login" @click="loginUser" />
    <!-- <button>Log In</button> -->
    <p>or</p>
    <RouterLink to="/Register"><DefaultButton msg="Register" /></RouterLink>
  </div>
</template>

<style scoped>
  h6 {
    background-color: rgb(0, 0, 0);
    color: red;
    padding: 1rem;
  }
  .login-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 400px;
    gap: 1em;
    font-size: 20px;
  }
  .login-page div {
    /* display: flex;
  justify-content: space-between;
  width: 300px; */
  }
  .login-page div input {
    width: 200px;
    height: 40px;
    border-radius: 5px 5px 5px 5px;
    background-color: var(--vt-c-white-mute);
  }
  button {
    width: 200px;
    padding: 0.4rem;
  }
  /* #newBtn{
  width: 200px;
} */
</style>
