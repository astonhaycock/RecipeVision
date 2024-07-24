<script setup lang="ts">
import { ref, computed, watch, onMounted, inject } from "vue";
import type { Ref } from "vue";
import ImageUpload from "./ImageUpload.vue";

const emit = defineEmits(["ingredient-change"]);

const mobile = inject("mobile") as Ref<boolean>;

const items = defineModel<Array<string>>("ingredients", { required: true });

const loading = ref(false);
const drawer = ref(false);
const search = ref("");
const selected: Ref<Array<string>> = ref([]);
const removedItems: Ref<Array<string>> = ref([]);

const allSelected = computed(
  () => selected.value.length === items.value.length
);

const categories = computed(() => {
  const searchText = search.value.toLowerCase();
  if (!searchText) return items.value;

  return items.value.filter((item) => item.toLowerCase().includes(searchText));
});

// const toggleDrawerIcon = ref("mdi-chevron-right");
const toggleDrawerIcon = ref("mdi-food-apple");
const toggleDrawerIconColor = ref("red-darken-1");

watch(drawer, () => {
  if (drawer.value) {
    toggleDrawerIcon.value = "mdi-chevron-left";
  } else {
    toggleDrawerIcon.value = "mdi-food-apple";
    // toggleDrawerIcon.value = "mdi-chevron-right";
  }
});

// const selections = selected.value;

function toggleDrawer() {
  drawer.value = !drawer.value;
  getIngredients();
}

watch(selected, () => {
  search.value = "";
});

async function deleteList() {
  console.log(selected.value);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  loading.value = true;
  const data = { items: selected.value };
  const requestOptions = {
    headers: myHeaders,
    method: "DELETE",
    body: JSON.stringify(data),
  };
  const response = await fetch(
    `${import.meta.env.VITE_PUBLIC_URL}/api/ingredients`,
    requestOptions
  );
  if (response.status === 204) {
    setTimeout(() => {
      removedItems.value = removedItems.value.concat(selected.value);
      items.value = items.value.filter(
        (item) => !removedItems.value.includes(item)
      );
      selected.value = [];
      loading.value = false;
      emit("ingredient-change");
    }, 2000);
    console.log("List deleted Successfully");
  } else {
    console.log("List not deleted");
  }
}

async function getIngredients() {
  removedItems.value = [];
  console.log("Getting Ingredients...");
  const response = await fetch(
    `${import.meta.env.VITE_PUBLIC_URL}/api/ingredients`
  );
  const data = await response.json();
  if (response.status === 200) {
    items.value = data;
    console.log("Ingredient got Successfully");
    emit("ingredient-change");
  } else {
    console.log("Ingredients not received");
  }
}

function toggleIngredients() {
  loading.value = !loading.value;
}

onMounted(() => {
  if (!mobile) {
    getIngredients();
  }
});
</script>

<template>
  <v-container>
    <v-navigation-drawer
      v-model="drawer"
      :width="mobile && drawer ? 2400 : 350"
      id="ingredient-container"
      location="left"
      :mobile="mobile"
      :class="mobile ? 'elevation-0' : 'elevation-2 '"
      temporary
      disable-route-watcher
    >
      <!-- <v-fade-transition v-show="!drawer" mode="in-out" appear> -->
      <!-- </v-fade-transition> -->
      <v-container :class="mobile ? 'pr-10' : ''">
        <ImageUpload @update="getIngredients()" />
      </v-container>
      <v-card class="mx-auto" max-width="500">
        <v-container>
          <v-row align="center" justify="start">
            <v-col
              v-for="(selection, i) in selected"
              :key="selection"
              class="py-1 pe-0"
              cols="auto"
            >
              <v-chip
                :disabled="loading"
                closable
                @click:close="selected.splice(i, 1)"
              >
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
                @click="deleteList"
              >
                Delete
              </v-btn>
            </v-card-actions>
            <v-col cols="12">
              <v-text-field
                ref="searchField"
                v-model="search"
                label="Search or Add"
                hide-details
                single-line
              ></v-text-field>
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
              @click="selected.push(item)"
            >
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
        id="toggle-drawer"
        size="55"
        clipped
        :color="toggleDrawerIconColor"
        :class="
          !mobile
            ? 'position-fixed top-0 right-0 mr-n16 mt-4'
            : drawer
            ? 'position-fixed top-0 right-0  mr-4 mt-4'
            : 'position-fixed top-0 right-0 mr-n16 mt-4'
        "
        :icon="toggleDrawerIcon"
      ></v-btn>
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
  height: 400px;
  overflow: hidden;
  overflow-y: scroll;
}
#ingredient-container {
  height: 100vh;
}
</style>
