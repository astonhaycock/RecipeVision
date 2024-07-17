<script setup>
  import { ref, computed, watch } from "vue";
  import ImageUpload from "./ImageUpload.vue";

  const items = ref([
    {
      text: "GET /api/ingredient",
    },
  ]);

  const loading = ref(false);
  const search = ref("");
  const selected = ref([]);

  const allSelected = computed(() => selected.value.length === items.value.length);

  const categories = computed(() => {
    const searchText = search.value.toLowerCase();
    if (!searchText) return items.value;

    return items.value.filter((item) => item.text.toLowerCase().includes(searchText));
  });

  const selections = computed(() => selected.value);

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
</script>

<template>
  <v-navigation-drawer :width="350" id="ingredient-container" permanent>
    <ImageUpload />
    <v-card class="mx-auto" max-width="500">
      <v-container>
        <v-row align="center" justify="start">
          <v-col
            v-for="(selection, i) in selections"
            :key="selection.text"
            class="py-1 pe-0"
            cols="auto">
            <v-chip :disabled="loading" closable @click:close="selected.splice(i, 1)">
              <v-icon :icon="selection.icon" start></v-icon>

              {{ selection.text }}
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

      <v-list>
        <template v-for="item in categories">
          <v-list-item
            class="d-flex"
            v-if="!selected.includes(item)"
            :key="item.text"
            :disabled="loading"
            @click="selected.push(item)">
            <template v-slot:prepend>
              <v-icon :disabled="loading" :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
        </template>
      </v-list>

      <v-divider></v-divider>
    </v-card>
  </v-navigation-drawer>
</template>

<style scoped>
  #list-ingredients {
    list-style-type: none;
    padding: 0;
    margin: 0;
    align-items: center;
    justify-content: flex-start;
    height: 500px;
    overflow: hidden;
    overflow-y: scroll;
  }
  #ingredient-container {
    height: 100vh;
  }
</style>
