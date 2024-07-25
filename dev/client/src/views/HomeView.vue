<script setup lang="ts">
  import category_cards from "../components/HomeCategory.vue";
  import { defineComponent, defineProps, ref, inject, type Ref, reactive } from "vue";
  import home_info from "../components/HomeInfo.vue";
  import HomvePlanes from "../components/HomePlans.vue";
  import RecipeRow from "../components/recipes/RecipeRow.vue";
  const mobile = inject("mobile") as Ref<boolean>;
  import type { RecipeCollection } from "@/scripts/allrecipes";
  const recipe = reactive<RecipeCollection>({});
  const URL_recipe = `${import.meta.env.VITE_PUBLIC_URL}/ai/allrecipes/beef`;
  const items_row_one = [
    {
      title: "Breakfast",
      image:
        "https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      title: "Lunch",
      image:
        "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      title: "Dinner",
      image:
        "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];

  const items_row_two = [
    {
      title: "Beef",
      image:
        "https://images.pexels.com/photos/3997609/pexels-photo-3997609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      title: "Chicken",
      image:
        "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      title: "Seafood",
      image:
        "https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];
  const items_row_three = [
    {
      title: "Ai Generated",
      image:
        "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      title: "Our Favorite",
      image:
        "https://images.pexels.com/photos/718742/pexels-photo-718742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      title: "quick & easy",
      image:
        "https://images.pexels.com/photos/24182617/pexels-photo-24182617/free-photo-of-fried-chickens-served-on-wooden-tray.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];
  const modal = ref(true);
  function closeModal() {
    modal.value = false;
  }
  async function fetchRecipe() {
    const response = await fetch(URL_recipe);
    const data = await response.json();
    console.log(data);
    // recipe.push(data.recipes);
  }
</script>
<template>
  <div id="hero-img" elevation-16>
    <div id="hero-text">
      <div>
        <h2>Discover your next</h2>
        <h2>favorite recipe</h2>
      </div>

      <RouterLink id="btn" to="/food">
        <v-btn>Try now</v-btn>
      </RouterLink>
    </div>
  </div>
  <v-btn @click="fetchRecipe">click me</v-btn>
  <home_info />
  <category_cards :row="items_row_one" />
  <category_cards :row="items_row_two" />
  <category_cards :row="items_row_three" />
  <HomvePlanes />
  <!-- <RecipeRow
    v-for="(cards, query) in recipes"
    :recipes="{ query: query as string, cards: cards }" /> -->
</template>
<style>
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
    padding-top: 4rem;
  }
  #paper {
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    min-width: 300px;
    width: 1600px;
    /* max-width: 1600px; */
    margin: 2rem;
    height: 80%;
    margin-bottom: 5rem;
    display: flex;
  }
  #hero-text {
    display: flex;
    gap: 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  /* #hero-text #btn {
    display: flex;
    justify-content: center;
    align-items: ;
  } */
  #hero-img {
    background-image: url(../assets/heroimgnew.png);
    width: 100vw;
    height: 450px;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: self-end;
    padding-right: 9rem;
    text-align: left;
    font-size: x-large;
    margin-top: 5rem;
  }
  @media ((max-width: 800px)) {
    #hero-img {
      height: 300px;
      padding-right: 4rem;
      font-size: large;
      margin-top: 0rem;
    }
  }
  @media ((max-width: 550px)) {
    #hero-img {
      height: 300px;
      padding-right: 1rem;
      font-size: medium;
    }
    #recipe_modal {
      padding-top: 0rem;
      padding-bottom: 2rem;
    }
  }
</style>
