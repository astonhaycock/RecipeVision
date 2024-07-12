<script setup lang="ts">
  import { defineComponent } from "vue";
</script>
<script lang="ts">
  export default defineComponent({
    data() {
      return {
        user: {
          email: "",
          password: "",
        },
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
          "http://dogsmeow.asuscomm.com:8080/api/session",
          requestOptions
        );

        if (response.status === 201) {
          console.log("Successfully logged in");
          this.user = { email: "", password: "" }; // Clear user form data
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

        const response = await fetch(
          "http://dogsmeow.asuscomm.com:8080/api/users",
          requestOptions
        );

        if (response.status === 201) {
          console.log("Successfully registered");
          await this.loginUser();
        } else {
          console.log("Failed to register");
        }
      },
    },
    computed: {},
  });
</script>
<template>
  <div class="login-page">
    <h1>Create Account</h1>
    <div>
      <input placeholder="Name" />
    </div>
    <div>
      <input placeholder="Email" />
    </div>
    <div>
      <input placeholder="Password" />
    </div>
    <button @click="registerUser">Create New Account</button>
    <p>or</p>
    <RouterLink to="/login">Log In</RouterLink>
  </div>
</template>

<style scoped>
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
