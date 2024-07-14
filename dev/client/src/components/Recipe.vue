<script setup lang="ts">
  import { defineComponent } from "vue";
  import DefaultButton from "../components/DefaultButton.vue";
</script>
<script lang="ts">
  export default defineComponent({
    data() {
      return {
        recipes: [
          {
            title: "pizza",
            description:
              "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit similique",
            img: "https://www.cookingclassy.com/wp-content/uploads/2014/07/pepperoni-pizza3+srgb..jpg",
            missing: ["flour", "sauce", "pepperoni"],
          },
          {
            title: "test",
            description:
              "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit similique",
            img: "https://www.cookingclassy.com/wp-content/uploads/2014/07/pepperoni-pizza3+srgb..jpg",
            missing: ["flour", "sauce", "pepperoni"],
          },
        ],
      };
    },
    methods: {},
    computed: {},
  });
</script>
<template>
  <div id="recipe-box" v-for="recipe in recipes">
    <img :src="recipe.img" />
    <div>
      <h3>{{ recipe.title }}</h3>
      <p>
        {{ recipe.description }}
      </p>
      <div>
        <h4>missing ingredients</h4>
        <div class="missing-ingredients">
          <p id="missing" v-for="ingredient in recipe.missing">
            {{ ingredient }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  img {
    max-width: 200px;
    max-height: 150px;
    height: auto;
    width: auto;
  }
  h4 {
    text-align: center;
  }
  .missing-ingredients {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  #missing {
    display: flex;
    background-color: red;
    border-radius: 10px;
    text-align: center;
    width: 40%;
  }
  #recipe-box {
    display: flex;
    gap: 1rem;
    width: 100%;
    height: 250px;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.104);
    padding: 1rem;
  }
</style>
