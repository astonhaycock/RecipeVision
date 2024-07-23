<script setup lang="ts">
  import RecipeRow from "@/components/recipes/RecipeRow.vue";
  import AiRecipeRow from "@/components/recipes/AiRecipeRow.vue";
  import { search_multiple as allrecipes } from "@/scripts/allrecipes";
  import type { RecipeCollection } from "@/scripts/allrecipes";
  import type { AiRecipeCollection } from "@/scripts/airecipes";
  import { onMounted, reactive, ref, provide, onBeforeMount, inject, type Ref } from "vue";
  import type { AiCard } from "@/scripts/airecipes";

  const recipes = reactive<RecipeCollection>({});
  const ai_recipes = reactive<AiRecipeCollection>([]);
  const modal = inject("recipe_modal") as Ref<AiCard | null>;
  console.log(modal);
  // const recipes = reactive<RecipeCollection>({
  //   "beef roast": [
  //     {
  //       title: "Beef Roast in Red Wine (Carni Arrosto al Vino Rosso)",
  //       id: "217132",
  //       url: "https://www.allrecipes.com/recipe/217132/beef-roast-in-red-wine-carni-arrosto-al-vino-rosso/",
  //       image:
  //         "https://www.allrecipes.com/thmb/tN-kiBmzWiFV5Vbw-FCivOz8pOI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/9158202-8a884398db364e868e2e0f2b80a772bf.jpg",
  //       stars: 4,
  //       reviews: 117,
  //     },
  //     {
  //       title: "Beef Roast in Red Wine (Carni Arrosto al Vino Rosso)",
  //       id: "217132",
  //       url: "https://www.allrecipes.com/recipe/217132/beef-roast-in-red-wine-carni-arrosto-al-vino-rosso/",
  //       image:
  //         "https://www.allrecipes.com/thmb/tN-kiBmzWiFV5Vbw-FCivOz8pOI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/9158202-8a884398db364e868e2e0f2b80a772bf.jpg",
  //       stars: 4,
  //       reviews: 117,
  //     },
  //     {
  //       title: "Beef Roast in Red Wine (Carni Arrosto al Vino Rosso)",
  //       id: "217132",
  //       url: "https://www.allrecipes.com/recipe/217132/beef-roast-in-red-wine-carni-arrosto-al-vino-rosso/",
  //       image:
  //         "https://www.allrecipes.com/thmb/tN-kiBmzWiFV5Vbw-FCivOz8pOI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/9158202-8a884398db364e868e2e0f2b80a772bf.jpg",
  //       stars: 4,
  //       reviews: 117,
  //     },
  //     {
  //       title: "Beef Roast in Red Wine (Carni Arrosto al Vino Rosso)",
  //       id: "217132",
  //       url: "https://www.allrecipes.com/recipe/217132/beef-roast-in-red-wine-carni-arrosto-al-vino-rosso/",
  //       image:
  //         "https://www.allrecipes.com/thmb/tN-kiBmzWiFV5Vbw-FCivOz8pOI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/9158202-8a884398db364e868e2e0f2b80a772bf.jpg",
  //       stars: 4,
  //       reviews: 117,
  //     },
  //   ],
  // });

  //TODO: Split this off into multiple functions.
  //TODO: sanity check to avoid yelling at the server.
  async function updateRecipes() {
    //TODO: This should just be on the server, honestly

    // const response = await fetch(
    //   `${import.meta.env.VITE_PUBLIC_URL}/api/recipes`
    // );
    // //TODO: Handle errors in a more user-friendly way.
    // if (response.status !== 200) {
    //   console.error("Failed to fetch recipes.");
    //   return;
    // }
    // const recipe_ideas = await response.json();
    const recipe_ideas = [
      "spinach casserole",
      "beef roast",
      "roast chicken",
      "lentil soup",
      "parmesan chicken",
    ];
    allrecipes(recipe_ideas, (recipe) => {
      if (recipe.query in recipes) {
        recipes[recipe.query].push(...recipe.cards);
      } else {
        recipes[recipe.query] = recipe.cards;
      }
    });
  }
  async function getGenerateRecipes() {
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/ai/recipe`);
    if (response.status === 200) {
      const data = await response.json();
      ai_recipes.push(data);
    }
  }
  async function generateRecipes() {
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/recipe/generate`);
    if (response.status === 200) {
      const data = await response.json();
      ai_recipes.push(data);
      getGenerateRecipes();
    }
  }
  onBeforeMount(() => {
    onBeforeMount(() => {
      if (modal) {
        modal.value = null;
      }
    });
  });

  onMounted(() => {
    updateRecipes();
    getGenerateRecipes();
  });
</script>

<template>
  <v-main class="position-absolute top-0 mx-0 px-0 w-100 fill-height bg-grey-lighten-4">
    <v-container class="mx-auto mb-16 bg-grey-lighten-4" fluid>
      <v-row class="mt-3 mb-8">
        <v-spacer></v-spacer>
        <div class="text-h3" @click="generateRecipes">Recipes</div>
        <v-spacer></v-spacer>
      </v-row>
      <AiRecipeRow :recipes="ai_recipes" v-if="ai_recipes.length > 0" />
      <RecipeRow
        v-for="(cards, query) in recipes"
        :recipes="{ query: query as string, cards: cards }" />

      <v-card
        ><div id="recipe_modal" v-if="modal">
          <div id="paper" class="d-flex flex-column">
            <div class="d-flex h-50">
              <v-img
                lazy-src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                :src="modal?.image"
                class="w-50"
                alt="Recipe Image" />
              <div class="text-h4 pt-5 ma-4 d-flex justify-center align-center">
                {{ modal.title }}
              </div>
            </div>
            <div>
              <h4>{{ modal.description }}</h4>
              <div class="d-flex justify-space-around">
                <ul>
                  <li v-for="instruction in modal.instructions" :key="instruction">
                    {{ instruction }}
                  </li>
                </ul>
                <ul>
                  <li v-for="ingredient in modal.ingredients" :key="ingredient">
                    {{ ingredient }}
                  </li>
                </ul>
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
