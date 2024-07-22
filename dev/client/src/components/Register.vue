<script setup lang="ts">
  import { ref, defineEmits } from "vue";
  import DefaultButton from "../components/DefaultButton.vue";
  import { useRouter, useRoute } from "vue-router";
  import { useMediaQuery } from "@vueuse/core";
  const emit = defineEmits(["login", "loginPage"]);
  const mobile = useMediaQuery("(min-width: 800px)");
  const email_regex =
    /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const password_specialC_regex = /[!@#$%^&*(),.?":{}|<>]/;
  const password_uppercase_regex = /[A-Z]/;
  const password_lowercase_regex = /[a-z]/;
  const password_number_regex = /[0-9]/;
  const user = ref({
    email: "",
    password: "",
    password2: "",
  });
  const loading = ref(false);
  const form = ref(false);

  const router = useRouter();
  const page = ref("login");
  function pageChange(pageSelected: string) {
    page.value = pageSelected;
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

    const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/user`, requestOptions);

    if (response.status === 201) {
      console.log("Successfully registered");
      await loginUser();
    } else {
      console.log("Failed to register");
    }
  }
  async function loginUser() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(user.value),
    };

    const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/session`, requestOptions);

    if (response.status === 201) {
      console.log("Successfully logged in");
      router.push("/");
      user.value = { email: "", password: "", password2: "" }; // Clear user form data
      emit("login");
    } else {
      console.log("Failed to login");
    }
  }
  function validPassword(v: string) {
    if (v.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (v.length > 64) {
      return "Password must not exceed 64 characters";
    }
    if (!v.match(password_specialC_regex)) {
      return "Password must contain at least one special character";
    }
    if (!v.match(password_uppercase_regex)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!v.match(password_lowercase_regex)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!v.match(password_number_regex)) {
      return "Password must contain at least one number";
    }
    return !!v;
  }
  function required(v: string) {
    return !!v || "Field is required";
  }
  function validEmail(v: string) {
    return !!v.match(email_regex) || "Email not valid";
  }
  function passwordMatch(v: string) {
    return user.value.password === v || "Passwords do not match";
  }
</script>

<template>
  <v-sheet id="sheet" rounded :class="mobile ? 'align-center' : 'align-start pt-8'">
    <v-card id="login-container" class="mx-auto" height="600px" min-width="300">
      <v-form
        class="pa-15"
        :class="mobile ? 'pa-15' : ' pt-0'"
        id="form-container"
        v-model="form"
        @submit.prevent="registerUser"
        min-width="300"
        width="500"
        elevation-80>
        <h1 class="pb-10">Create an Account</h1>
        <v-text-field
          v-model="user.email"
          :readonly="loading"
          :rules="[required, validEmail]"
          label="Email"
          width="300px"
          clearable></v-text-field>

        <v-text-field
          v-model="user.password"
          :readonly="loading"
          :rules="[required, validPassword]"
          label="Password"
          placeholder="Enter your password"
          width="300px"
          type="password"
          clearable></v-text-field>
        <v-text-field
          v-model="user.password2"
          :readonly="loading"
          :rules="[required, passwordMatch]"
          label="Confirm Password"
          placeholder="Enter your password"
          width="300px"
          type="password"
          clearable></v-text-field>

        <br />

        <div id="btn">
          <v-btn
            :disabled="!form"
            :loading="loading"
            color="success"
            size="large"
            type="submit"
            variant="elevated"
            block>
            Register
          </v-btn>

          <p v-if="!mobile">or</p>

          <v-chip
            @click="$emit('loginPage')"
            id="btn-chip"
            class="d-flex justify-center align-center"
            v-if="!mobile"
            size="large"
            variant="elevated"
            block>
            Login
          </v-chip>
        </div>
      </v-form>
      <div id="login" class="pa-10" v-if="mobile">
        <h1>Welcome to Register page</h1>
        <p>have an account?</p>
        <v-chip @click="$emit('loginPage')">Login</v-chip>
      </div>
    </v-card>
  </v-sheet>
</template>

<style scoped>
  #btn p {
    text-align: center;
  }
  #btn {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 200px;
    gap: 1rem;
  }
  #btn-chip {
    width: 100px;
    text-align: center;
  }

  #form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #5ab2ff;
    gap: 1rem;
    width: 400px;
  }
  #sheet {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: rgba(188, 189, 191, 0.893);
  }
  #login-container {
    display: flex;
    height: 500px;
  }
</style>
