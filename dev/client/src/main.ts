import "@mdi/font/css/materialdesignicons.css";
import "./assets/main.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

console.log(`\x1b[92mVue client sends requests to ${import.meta.env.VITE_PUBLIC_URL}:{import.meta.env.VITE_PUBLIC_PORT}`);

const vuetify = createVuetify({
  components,
  directives,
});

app.use(vuetify);
app.use(router);
app.provide("current_user", { email: "", IngredientList: "" });

app.mount("#app");
