<script setup lang="ts">
  import { RouterLink} from "vue-router";
  import { inject, ref, defineModel } from "vue";
  import type { ModelRef, Ref } from "vue";
  import companyLogo from "./icons/logo.vue";
  const emit = defineEmits(["logout", "contact"]);

  const mobile = inject("mobile") as Ref<boolean>;

  // const current_user = defineModel<{
  //   login: boolean;
  // }>();
  const current_user = defineModel("login") as ModelRef<string>;

  // const login = ref(false);
  const message = ref("Hello, World!");
  const nav_open = ref(false);
  
  // const current_user = ref(false);
</script>

<template>
  <v-app-bar color="grey-lighten-4" height="60" :elevation="10" v-if="!mobile">
    <companyLogo height="120px" width="120px" />
    <RouterLink to="/"
      ><v-btn class="me-2" color="grey-lighten-4" height="70" variant="flat" width="90"
        >Home</v-btn
      ></RouterLink
    >
    <RouterLink v-if="current_user" to="/food">
      <v-btn class="me-2" color="grey-lighten-4" height="70" variant="flat" width="90">
        Food</v-btn
      ></RouterLink
    >
    <v-app-bar-title>
      <RouterLink v-if="!current_user" to="/auth" class="float-right">
        <v-btn class="me-2" color="grey-lighten-4" height="90" variant="flat" width="90">
          Login</v-btn
        ></RouterLink
      >
      <v-menu v-else>
        <template v-slot:activator="{ props }">
          <v-btn
            class="me-2 float-right rounded-0"
            height="90px"
            width="100px"
            size="xx-large"
            icon="mdi-cog"
            v-bind="props"></v-btn>
        </template>
        <v-list class="d-flex flex-column">
          <!-- setting page needing to be made -->
          <v-list-item>
            <v-btn
              @click="$emit('contact')"
              color="grey-lighten-4"
              height="60"
              variant="flat"
              width="125">
              Contact Us</v-btn
            >
          </v-list-item>
          <v-list-item>
            <v-btn
              msg="Logout"
              @click="$emit('logout')"
              color="grey-lighten-4"
              height="60"
              variant="flat"
              width="125">
              logout</v-btn
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar-title>
  </v-app-bar>
  <v-bottom-navigation v-else height="100" class="d-flex justify-center align-center">
    <!-- logo -->
    <!-- <companyLogo height="50px" width="50px" class="d-flex justify-center align-center" /> -->
    <RouterLink to="/">
      <v-btn class="me-2" color="grey-lighten-4" variant="flat" height="90" width="90"
        ><v-icon icon="mdi-home" size="35"</v-icon
      ></v-btn>
    </RouterLink>
    <RouterLink v-if="current_user" to="/food">
      <v-btn class="me-2" color="grey-lighten-4" height="90" variant="flat" width="90">
        <!-- <v-icon color="brown" icon="mdi-silverware-spoon" size="x-large" end></v-icon> -->
        <companyLogo height="60px" width="60px" class="d-flex justify-center align-center" />

      </v-btn></RouterLink
    >
    <RouterLink v-if="!current_user" to="/auth" class="float-right">
      <v-btn class="me-2" color="grey-lighten-4" height="90" variant="flat" width="90">
        Login</v-btn
      ></RouterLink
    >
    <v-menu v-else>
      <template v-slot:activator="{ props }">
        <v-btn class="me-2 float-right" height="90" v-bind="props"
          ><v-icon icon="mdi-cog" size="35"></v-icon
        ></v-btn>
      </template>
      <v-list class="d-flex flex-column">
        <v-list-item>
            <v-btn
              @click="$emit('contact')"
              color="grey-lighten-4"
              height="60"
              variant="flat"
              width="125">
              Contact Us</v-btn
            >
        </v-list-item>
        <v-list-item>
          <v-btn
            msg="Logout"
            @click="$emit('logout')"
            color="grey-lighten-4"
            height="60"
            variant="flat"
            width="125">
            logout</v-btn
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </v-bottom-navigation>
</template>

<style scoped></style>
