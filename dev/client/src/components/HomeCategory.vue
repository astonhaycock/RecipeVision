<script setup lang="ts">
  import { defineProps, onMounted, reactive, watch, ref, inject, type Ref } from "vue";

  const mobile = inject("mobile") as Ref<boolean>;
  defineProps<{
    row: Array<{ title: string; image: string }>;
  }>();

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
      <v-slide-group-item v-for="(item, index) in row" :key="index">
        <div class="pa-5">
          <v-hover v-slot="{ isHovering, props }">
            <v-card class="mx-auto" height="300px" v-bind="props" :width="mobile ? 250 : 344">
              <v-card-text>
                <h2 class="text-h3 text-black text-center">{{ item.title }}</h2>
              </v-card-text>
              <v-img :src="item.image" lazy-src="../assets/steak.jpeg"</v-img>

              <v-overlay
                :model-value="isHovering as boolean"
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
