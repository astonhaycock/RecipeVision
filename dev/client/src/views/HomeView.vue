<script setup lang="ts">
  import category_cards from "../components/HomeCategory.vue";
  import { defineComponent, defineProps } from "vue";
  import home_info from "../components/HomeInfo.vue";

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
  <home_info />
  <category_cards :row="items_row_one" />
  <category_cards :row="items_row_two" />
  <category_cards :row="items_row_three" />
</template>
<style>
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
  }
</style>
