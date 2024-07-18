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
const vuetify = createVuetify({
  components,
  directives,
});

app.use(vuetify);
app.use(router);
app.provide("current_user", { email: "", IngredientList: "" });

app.mount("#app");
