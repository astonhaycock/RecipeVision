<script setup lang="ts">
  import RecipeRow from "@/components/recipes/RecipeRow.vue";
  import { search_multiple as allrecipes } from "@/scripts/allrecipes";
  import type { RecipeCollection } from "@/scripts/allrecipes";
  import { onMounted, reactive, ref } from "vue";

  const recipes = reactive<RecipeCollection>({});
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
  async function generateRecipes() {
    const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/api/recipe/generate`);
  }

  onMounted(() => {
    updateRecipes();
  });
</script>

<template>
  <v-main class="position-absolute top-0 mx-0 px-0 w-100 fill-height bg-grey-lighten-4">
    <v-container class="mx-auto mb-16 bg-grey-lighten-4" fluid>
      <v-row class="mt-3 mb-8">
        <v-spacer></v-spacer>
        <div class="text-h3" @click="updateRecipes">Recipes</div>
        <v-spacer></v-spacer>
      </v-row>
      <RecipeRow
        v-for="(cards, query) in recipes"
        :recipes="{ query: query as string, cards: cards }" />
    </v-container>
  </v-main>
</template>
<style scoped></style>
