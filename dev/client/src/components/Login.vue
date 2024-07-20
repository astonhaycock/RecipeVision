<script setup lang="ts">
  import { ref, defineEmits } from "vue";
  import DefaultButton from "../components/DefaultButton.vue";
  import { useRouter, useRoute } from "vue-router";
  import { useMediaQuery } from "@vueuse/core";
  import { start } from "repl";
  const emit = defineEmits(["login", "registerPage"]);
  const email_regex =
    /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const mobile = useMediaQuery("(min-width: 800px)");

  const user = ref({
    email: "",
    password: "",
  });
  const loading = ref(false);
  const form = ref(false);
  const router = useRouter();
  const page = ref("login");
  function pageChange(pageSelected: string) {
    page.value = pageSelected;
  }

  async function loginUser() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch("https://dont-pani.cc/api/session", {
      credentials: "include",
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(user.value),
    });
    if (response.status === 201) {
      console.log("Successfully logged in");
      router.push("/");
      user.value = { email: "", password: "" }; // Clear user form data
      emit("login");
    } else {
      console.log("Failed to login");
    }
  }
  function required(v: string) {
    return !!v || "Field is required";
  }
  function validEmail(v: string) {
    return !!v.match(email_regex) || "Email not valid";
  }
</script>

<template>
  <v-sheet id="sheet" rounded :class="mobile ? 'align-center' : 'align-start pt-8'">
    <v-card id="login-container" class="mx-auto" height="600px" min-width="344">
      <v-form
        class="pa-15"
        id="form-container"
        v-model="form"
        @submit.prevent="loginUser"
        min-width="300"
        width="500"
        elevation-80>
        <h1 class="pb-10">Login</h1>
        <v-text-field
          id="input"
          class="mx-auto"
          v-model="user.email"
          :readonly="loading"
          :rules="[required, validEmail]"
          label="Email"
          width="300px"
          clearable></v-text-field>

        <v-text-field
          class="mx-auto"
          v-model="user.password"
          :readonly="loading"
          :rules="[required]"
          label="Password"
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
            Login
          </v-btn>

          <p v-if="!mobile">or</p>

          <v-chip
            @click="$emit('registerPage')"
            class="d-flex justify-center align-center"
            id="btn-chip"
            v-if="!mobile"
            size="large"
            variant="elevated"
            block>
            Register
          </v-chip>
        </div>
      </v-form>
      <div id="register" class="pa-10" v-if="mobile">
        <h1>Welcome to login page</h1>
        <p>Don't have an account?</p>
        <v-chip @click="$emit('registerPage')">Sign Up</v-chip>
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
  #register {
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
