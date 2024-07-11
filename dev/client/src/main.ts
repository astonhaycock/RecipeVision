import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import IngredientList from "./components/IngredientList.vue";

const app = createApp(App);

app.use(router);
app.provide("current_user", { username: "", email: "", IngredientList: "" });

app.mount("#app");
