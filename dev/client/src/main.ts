import "@mdi/font/css/materialdesignicons.css";
import "./assets/main.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { createApp, ref, watch } from "vue";
import App from "./App.vue";
import router from "./router";
import { useMediaQuery } from "@vueuse/core";

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
});

const mobile_width = useMediaQuery("(max-width: 800px)");
const mobile_aspect = useMediaQuery("(max-aspect-ratio: 5/8)");
const mobile = ref(false);
function mobile_update() {
  mobile.value = mobile_width.value || mobile_aspect.value;
}
watch([mobile_width, mobile_aspect], mobile_update);
mobile_update();

app.use(vuetify);
app.use(router);
app.provide("current_user", { email: "", IngredientList: "" });
app.provide("mobile", mobile);
app.provide("recipe_modal", ref(null));

app.mount("#app");
