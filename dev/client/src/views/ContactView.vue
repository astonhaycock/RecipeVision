<script setup lang="ts">
  import { defineProps, onMounted, reactive, watch, ref, inject, type Ref } from "vue";
  import { useField, useForm } from "vee-validate";
  const mobile = inject("mobile") as Ref<boolean>;

  const { handleSubmit, handleReset } = useForm({
    validationSchema: {
      name(value: string) {
        if (value?.length >= 2) return true;

        return "Name needs to be at least 2 characters.";
      },
      phone(value: string) {
        if (value?.length > 9 && /[0-9-]+/.test(value)) return true;

        return "Phone number needs to be at least 9 digits.";
      },
      email(value: string) {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;

        return "Must be a valid e-mail.";
      },
    },
  });
  const name = useField("name");
  const phone = useField("phone");
  const email = useField("email");
  const message = useField("message");

  // const submit = handleSubmit(async (values) => {
  //   console.log("test");
  //   const data = {
  //     name: name.value,
  //     phone: phone.value,
  //     email: email.value,
  //     message: message.value,
  //   };
  //   const headers = new Headers();
  //   headers.append("Content-Type", "application/json");
  //   const result = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/email`, {
  //     method: "POST",
  //     headers,
  //     body: JSON.stringify(data),
  //   });
  //   if (result.status === 200) {
  //     handleReset();
  //     return;
  //   }
  // });
  async function submit() {
    const data = {
      name: name.value.value,
      phone: phone.value.value,
      email: email.value.value,
      message: message.value.value,
    };
    console.log(data);
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const result = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/email`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (result.status === 200) {
      handleReset();
      return;
    }
  }
</script>
<template>
  <v-sheet
    elevation-24
    :class="mobile ? 'justify-start' : 'justify-center'"
    class="d-flex flex-row gap-2 align-center w-100 h-100 bg-grey-lighten-1 pa-16">
    <v-card
      elevation-24
      min-height="100"
      min-width="300px"
      width="500px"
      max-width="1000px"
      class="pa-8 d-flex flex-column justify-center align-center ga-4">
      <h1>Contact Us</h1>
      <form @submit.prevent="submit" class="w-100">
        <v-text-field
          class="text-center"
          v-model="name.value.value"
          :counter="10"
          :error-messages="name.errorMessage.value"
          label="Name"></v-text-field>

        <v-text-field v-model="phone.value.value" :counter="7" label="Phone Number"></v-text-field>

        <v-text-field
          v-model="email.value.value"
          :error-messages="email.errorMessage.value"
          label="E-mail"></v-text-field>
        <v-textarea rows="5" v-model="message.value.value" label="Message"></v-textarea>
        <div class="d-flex align-center justify-center ga-8">
          <v-btn @click="handleReset"> clear </v-btn>
          <v-btn class="me-4" type="submit"> submit </v-btn>
        </div>
      </form>
    </v-card>
  </v-sheet>
</template>

<style scoped></style>
