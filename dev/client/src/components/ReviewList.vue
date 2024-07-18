<script setup lang="ts">
  import icon from "./icons/IconUpload.vue";
  import { defineComponent, defineModel, onMounted, defineProps, ref, defineEmits } from "vue";
  import type { ModelRef, PropType, Ref } from "vue";
  const amenities: Ref<Array<Number>> = ref([]);
  const emit = defineEmits(["addIngredients"]);

  const ingredients: ModelRef<string[], string> = defineModel("reviewList") as ModelRef<
    string[],
    string
  >;

  const editingItem = ref(-1);
  const textInput = ref("");
  const loading_screen = ref(false);

  function handleReviewIngredients(data: string) {
    loading_screen.value = false;
  }
  function deleteIngredient(index: number) {
    ingredients.value.splice(index, 1);
    console.log(ingredients);
  }
  function edit(index: number) {
    textInput.value = ingredients.value[index];
    editingItem.value = index;
  }
  function save(index: number) {
    ingredients.value[index] = textInput.value;
    editingItem.value = -1;
  }
  async function sendIngredients(reviewList: Array<string>) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const data = { ingredients: reviewList };

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(data),
    };
    const response = await fetch("https://dont-pani.cc/api/ingredients", requestOptions);
    ingredients.value = [];
    if (response.status === 204) {
      console.log("Successfully added ingredient");
    } else {
      console.log("Failed to add ingredient");
    }
  }
</script>

<template>
  <v-card-text>
    <v-chip-group v-model="amenities" column multiple>
      <v-chip
        v-for="ingredient in ingredients"
        :text="ingredient"
        variant="outlined"
        filter-icon="mdi-plus"></v-chip>
    </v-chip-group>
  </v-card-text>
  <v-btn v-if="ingredients" @click="sendIngredients(ingredients), $emit('addIngredients')"
    >Add Ingredients</v-btn
  >
</template>

<style scoped></style>
