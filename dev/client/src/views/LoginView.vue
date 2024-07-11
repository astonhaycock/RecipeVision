<script setup lang="ts">
import { defineComponent, inject } from "vue";
</script>
<script lang="ts">
export default defineComponent({
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
      },
      currentUser: null,
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
      const data = await response.json();

      if (response.status === 201) {
        console.log("Successfully logged in");
        this.currentUser = data; // Assign fetched user data
        this.user = { name: "", email: "", password: "" }; // Clear user form data
      } else {
        console.log("Failed to login");
      }
    },
  },
  computed: {},
});
</script>

<template>
  <div class="login-page">
    <h1>Login Page</h1>
    <div>
      <input placeholder="Email" />
    </div>
    <div>
      <input placeholder="Password" />
    </div>
    <button>Log In</button>
    <p>or</p>
    <RouterLink to="/Register">Register</RouterLink>
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
