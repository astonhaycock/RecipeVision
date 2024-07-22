<script setup lang="ts">
  import { useMediaQuery } from "@vueuse/core";
  import { onMounted, reactive, watch, ref } from "vue";
  const mobile = useMediaQuery("(max-width: 800px)") && useMediaQuery("(max-aspect-ratio: 5/8)");
  const style = reactive<{
    pill_label: string;
    container: string;
  }>({ pill_label: "", container: "" });
  const isHovering = ref(false);

  function update() {
    if (mobile.value) {
      style.container = "mx-1 mt-4 mb-6";
      style.pill_label = "px-4 py-1 mt-2 ml-6 w-auto";
    } else {
      style.container = "mx-10 mt-16 mb-16";
      style.pill_label = "px-4 py-1 mt-4 ml-6 w-auto";
    }
  }

  watch(mobile, update);

  onMounted(update);
</script>

<template>
  <div class="d-flex align-center justify-center">
    <v-slide-group
      class="mt-2 px-2 d-flex align-center justify-center"
      :mobile="mobile"
      :show-arrows="mobile"
      center-active>
      <v-slide-group-item>
        <div class="pa-5">
          <v-hover v-slot="{ isHovering, props }">
            <v-card class="mx-auto" height="300px" v-bind="props" :width="mobile ? 250 : 344">
              <v-card-text>
                <h2 class="text-h3 text-black text-center">Breakfast</h2>
              </v-card-text>
              <v-img
                src="https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"></v-img>

              <v-overlay
                :model-value="isHovering"
                class="align-center justify-center"
                scrim="#036358"
                contained>
                <v-btn variant="flat">Explore Recipes</v-btn>
              </v-overlay>
            </v-card>
          </v-hover>
        </div>
      </v-slide-group-item>
      <v-slide-group-item>
        <div class="pa-5">
          <v-hover v-slot="{ isHovering, props }">
            <v-card class="mx-auto" height="300px" v-bind="props" :width="mobile ? 250 : 344">
              <v-card-text>
                <h2 class="text-h3 text-black text-center">Lunch</h2>
              </v-card-text>
              <v-img
                src="https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                class="cover"></v-img>

              <v-overlay
                :model-value="isHovering"
                class="align-center justify-center"
                scrim="#036358"
                contained>
                <v-btn variant="flat">Explore Recipes</v-btn>
              </v-overlay>
            </v-card>
          </v-hover>
        </div>
      </v-slide-group-item>
      <v-slide-group-item>
        <div class="pa-5">
          <v-hover v-slot="{ isHovering, props }">
            <v-card class="mx-auto" height="300px" v-bind="props" :width="mobile ? 250 : 344">
              <v-card-text>
                <h2 class="text-h3 text-black text-center">Dinner</h2>
              </v-card-text>
              <v-img
                src="https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                class="cover"></v-img>

              <v-overlay
                :model-value="isHovering"
                class="align-center justify-center"
                scrim="#036358"
                contained>
                <v-btn variant="flat">Explore Recipes</v-btn>
              </v-overlay>
            </v-card>
          </v-hover>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>