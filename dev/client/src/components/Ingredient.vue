<script setup lang="ts">
  import { ref, computed, watch, onMounted } from "vue";
  import type { Ref } from "vue";
  import ImageUpload from "./ImageUpload.vue";
  import { useMediaQuery } from "@vueuse/core";
  const mobile = useMediaQuery("(max-width: 800px)");

  const items: Ref<Array<string>> = ref([]);

  const loading = ref(false);
  const drawer = ref(false);
  const search = ref("");
  const selected: Ref<Array<string>> = ref([]);

  const allSelected = computed(() => selected.value.length === items.value.length);

  const categories = computed(() => {
    const searchText = search.value.toLowerCase();
    if (!searchText) return items.value;

    return items.value.filter((item) => item.toLowerCase().includes(searchText));
  });

  const toggleDrawerIcon = ref("mdi-chevron-left");

  watch(drawer, () => {
    if (drawer.value) {
      toggleDrawerIcon.value = "mdi-chevron-left";
    } else {
      toggleDrawerIcon.value = "mdi-chevron-right";
    }
  });

  const selections = selected.value;

  function toggleDrawer() {
    drawer.value = !drawer.value;
  }

  watch(selected, () => {
    search.value = "";
  });

  const next = () => {
    loading.value = true;

    setTimeout(() => {
      search.value = "";
      selected.value = [];
      loading.value = false;
    }, 2000);
  };

  async function getIngredients() {
    const response = await fetch("https://dont-pani.cc/api/ingredients");
    const data = await response.json();
    if (response.status === 200) {
      items.value = data;
      console.log("Ingredient got Successfully");
      console.log(data);
      console.log(items.value);
    } else {
      console.log("Ingredients not received");
    }
    function toggleIngredients() {
      loading.value = !loading.value;
    }
    onMounted(() => {
      getIngredients();
    });
  }
</script>

<template>
  <v-container>
    <v-navigation-drawer
      v-model="drawer"
      :width="mobile && drawer ? 2400 : 350"
      id="ingredient-container"
      :location="left"
      :mobile="mobile"
      :class="mobile ? 'elevation-0' : 'elevation-2'"
      temporary
      disable-route-watcher>
      <!-- <v-fade-transition v-show="!drawer" mode="in-out" appear> -->
      <!-- </v-fade-transition> -->
      <v-container :class="mobile ? 'pr-10' : ''">
        <ImageUpload @update="getIngredients()" />
      </v-container>
      <v-card class="mx-auto" max-width="500">
        <v-container>
          <v-row align="center" justify="start">
            <v-col
              v-for="(selection, i) in selections"
              :key="selection"
              class="py-1 pe-0"
              cols="auto">
              <v-chip :disabled="loading" closable @click:close="selected.splice(i, 1)">
                {{ selection }}
              </v-chip>
            </v-col>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                v-if="selected.length"
                :loading="loading"
                color="purple"
                variant="text"
                @click="next">
                Delete
              </v-btn>
            </v-card-actions>
            <v-col cols="12">
              <v-text-field
                ref="searchField"
                v-model="search"
                label="Search or Add"
                hide-details
                single-line></v-text-field>
            </v-col>
          </v-row>
        </v-container>

        <v-divider v-if="!allSelected"></v-divider>

        <v-list id="list-ingredients">
          <template v-for="item in categories">
            <v-list-item
              class="d-flex"
              v-if="!selected.includes(item)"
              :key="item"
              :disabled="loading"
              @click="selected.push(item)">
              <template v-slot:prepend>
                <v-icon :disabled="loading"></v-icon>
              </template>

              <v-list-item-title v-text="item"></v-list-item-title>
            </v-list-item>
          </template>
        </v-list>

        <v-divider></v-divider>
      </v-card>
      <v-btn
        @click="toggleDrawer"
        :class="
          !mobile
            ? 'position-fixed top-0 right-0 mr-n16 mt-4'
            : drawer
            ? 'position-fixed top-0 right-0 mr-4 mt-4'
            : 'position-fixed top-0 right-0 mr-n16 mt-4'
        "
        :icon="toggleDrawerIcon"></v-btn>
    </v-navigation-drawer>
  </v-container>
</template>

<style scoped>
  #list-ingredients {
    list-style-type: none;
    padding: 0;
    margin: 0;
    align-items: center;
    justify-content: flex-start;
    height: 350px;
    overflow: hidden;
    overflow-y: scroll;
  }
  #ingredient-container {
    height: 90vh;
  }
</style>
