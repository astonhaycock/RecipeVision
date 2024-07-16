<script setup lang="ts">
  import { ref, defineEmits } from "vue";
  import DefaultButton from "../components/DefaultButton.vue";
  const emit = defineEmits(["login"]);

  const user = ref({
    email: "",
    password: "",
  });

  async function loginUser() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(user.value),
    };

    const response = await fetch(
      "https://dont-pani.cc/api/session",
      requestOptions
    );

    if (response.status === 201) {
      console.log("Successfully logged in");
      user.value = { email: "", password: "" }; // Clear user form data
      emit("login");
    } else {
      console.log("Failed to login");
    }
  }

  async function registerUser() {
    console.log(user.value);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(user.value),
    };

    const response = await fetch(
      "https://dont-pani.cc/api/user",
      requestOptions
    );

    if (response.status === 201) {
      console.log("Successfully registered");
      await loginUser();
    } else {
      console.log("Failed to register");
    }
  }
</script>

<template>
  <div class="login-page">
    <h1>Register</h1>
    <div>
      <input type="email" placeholder="Email" v-model="user.email" />
    </div>
    <div>
      <input placeholder="Password" v-model="user.password" />
    </div>
    <DefaultButton msg="Register" @click="registerUser" />
    <p>or</p>
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
    border-radius: 5px;
    background-color: var(--vt-c-white-mute);
  }
  button {
    width: 200px;
    padding: 0.4rem;
  }
</style>
