<script setup lang="ts">
  import { ref, defineEmits } from "vue";
  import DefaultButton from "../components/DefaultButton.vue";
  import { useRouter, useRoute } from "vue-router";
  const emit = defineEmits(["login"]);

  const user = ref({
    email: "",
    password: "",
  });
  const loading = ref(false);
  const form = ref(false);
  const router = useRouter();

  async function loginUser() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(user.value),
    };

    const response = await fetch("https://dont-pani.cc/api/session", requestOptions);

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
</script>

<template>
  <v-sheet class="pa-12" id="sheet" rounded>
    <v-card id="login-container" class="mx-auto px-6 py-8" min-width="344">
      <v-form
        id="form-container"
        v-model="form"
        @submit.prevent="loginUser"
        min-width="300"
        width="500"
        elevation-80>
        <v-text-field
          v-model="user.email"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          label="Email"
          width="300px"
          clearable></v-text-field>

        <v-text-field
          v-model="user.password"
          :readonly="loading"
          :rules="[required]"
          label="Password"
          placeholder="Enter your password"
          width="300px"
          type="password"
          clearable></v-text-field>

        <br />

        <v-btn
          :disabled="!form"
          :loading="loading"
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          block>
          Sign In
        </v-btn>
      </v-form>
      <div id="register"><p>kasdklfas;ldkfalksjkdflkjasdf</p></div>
    </v-card>
  </v-sheet>
</template>

<style scoped>
  #form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #register {
    padding: 1rem;
    width: 300px;
  }
  #sheet {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: rgba(188, 189, 191, 0.893);
    padding: 3rem;
  }
  #login-container {
    display: flex;
    /* min-width: 350px;
    max-width: 800px; */
    height: 400px;
  }
</style>
