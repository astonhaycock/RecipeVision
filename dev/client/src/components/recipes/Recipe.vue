<script setup lang="ts">
  import RecipeRow from "@/components/recipes/RecipeRow.vue";
  import AiRecipeRow from "@/components/recipes/AiRecipeRow.vue";
  import type { RecipeCollection } from "@/scripts/allrecipes";
  import type { AiRecipeCollection } from "@/scripts/airecipes";
  import { onMounted, reactive, ref, provide, onBeforeMount, inject, type Ref } from "vue";
  import type { AiCard } from "@/scripts/airecipes";
  const mobile = inject("mobile") as Ref<boolean>;
  const recipes = defineModel<RecipeCollection>("recipes", { required: true });
  const ai_recipes = ref<AiRecipeCollection>([]);
  const modal = inject("recipe_modal") as Ref<AiCard | null>;
  const fullRecipeRefresh = inject("fullRecipeRefresh") as () => void;
  const hover = ref(false);
  const URL_image = `${import.meta.env.VITE_PUBLIC_URL}/api/ai/image/`;
  const ai_recipe_selected = ref(false);
  
  async function getGenerateRecipes() {
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/ai/recipes`);
    if (response.status === 200) {
      const data = await response.json();
      ai_recipes.value = data;
    }
  }
  async function generateRecipes() {
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/recipe/generate`);
    if (response.status === 200) {
      const data = await response.json();
      getGenerateRecipes();
    }
  }
  function closeModal() {
    modal.value = null;
  }
  onBeforeMount(() => {
    onBeforeMount(() => {
      if (modal) {
        modal.value = null;
      }
    });
  });

  onMounted(() => {
    getGenerateRecipes();
  });
</script>

<template>
  <v-main class="position-absolute top-0 mx-0 px-0 w-100 fill-height bg-grey-lighten-4">
    <v-container class="mx-auto mb-16 bg-grey-lighten-4" fluid>
      <v-row class="mt-3 d-flex justify-center align-center">
        <v-card class="pa-12 mt-3 d-flex justify-center align-center ga-5" elevation-24>
          <div class="text-h3">Recipes</div>
          <div class="d-flex flex-column ga-4">
            <v-btn class="text-h6 bg-green" @click="generateRecipes">Generate Ai Recipe</v-btn>

            <v-btn class="text-h6 bg-green" @click="fullRecipeRefresh">Refresh Recipes</v-btn>
          </div></v-card
        >
      </v-row>
      <AiRecipeRow :recipes="ai_recipes" v-if="ai_recipes.length > 0" />
      <template v-for="(cards, query) in recipes as RecipeCollection">
        <RecipeRow v-if="cards.length > 0" :recipes="{ query: query as string, cards: cards }" />
      </template>

      <v-card
        ><div id="recipe_modal" v-if="modal">
          <div id="paper" class="d-flex flex-column ga-2 overflow-auto">
            <div class="d-flex justify-end">
              <v-icon
                size="40"
                color="white"
                class="bg-red"
                icon="mdi-close-thick"
                id="icon_exit"
                @click="closeModal"></v-icon>
            </div>

            <div
              class="d-flex h-50 ga-2"
              :class="mobile ? 'flex-column justify-center align-center' : 'flex-row'">
              <v-img
                lazy-src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                :src="URL_image + modal?.image"
                class="w-50"
                alt="Recipe Image" />
              <div class="text-h4 pt-5 ma-4 d-flex justify-center align-center">
                {{ modal.title }}
              </div>
            </div>
            <div>
              <h4>{{ modal.description }}</h4>
              <div class="d-flex justify-space-around" :class="mobile ? 'flex-column' : 'flex-row'">
                <div class="d-flex flex-column" :class="mobile ? 'w-90' : 'w-50'">
                  <h2>Instructions</h2>
                  <ol class="ml-8">
                    <li v-for="instruction in modal.instructions" :key="instruction">
                      {{ instruction }}
                    </li>
                  </ol>
                </div>

                <div class="d-flex flex-column">
                  <h2>Ingredients</h2>
                  <ul class="ml-8">
                    <li v-for="ingredient in modal.ingredients" :key="ingredient">
                      {{ ingredient }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div></v-card
      >
    </v-container>
  </v-main>
</template>
<style scoped>
  #recipe_modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #paper {
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    min-width: 300px;
    width: 800px;
    max-width: 1000px;
    margin: 2rem;
    height: 80%;
    margin-bottom: 5rem;
  }
</style>
