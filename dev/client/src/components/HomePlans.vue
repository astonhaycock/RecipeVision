<script setup lang="ts">
  import { defineProps, onMounted, reactive, watch, ref, inject, type Ref } from "vue";

  const mobile = inject("mobile") as Ref<boolean>;
</script>

<template>
  <v-sheet id="container" class="d-flex flex-column ga-2 pt-5 align-center w-100" elevation="24">
    <h1>Pricing</h1>
    <p>
      Our pricing is based on your usage and the number of recipes you generate. Our goal is to have
      a plan for each person needs.
    </p>
    <p></p>

    <div id="steps" class="d-flex w-75 justify-center mb-16">
      <div id="text-box" class="d-flex align-center flex-column ga-4 pa-4" elevation-24>
        <h1 color="white">Free</h1>
        <h3>what's Included</h3>
        <v-divider class="w-75"></v-divider>
        <h4>5 Ai recipes per month</h4>
        <h4>recipe recommendation</h4>
        <h4>Digital pantry</h4>
        <v-divider class="w-75"></v-divider>
        <h2>Free</h2>
        <v-btn class="mt-5 w-75">Create New Account</v-btn>
      </div>
      <v-card id="text-box" class="d-flex align-center pa-4 flex-column ga-4 bg-blue" elevation-24>
        <h1 color="white">Premium</h1>
        <h3>what's Included</h3>
        <v-divider class="w-75"></v-divider>
        <h4>50 Ai recipes per month</h4>
        <h4>recipe recommendation</h4>
        <h4>Digital pantry</h4>
        <v-divider class="w-75"></v-divider>
        <h2>7.99 / month</h2>
        <v-btn class="mt-5 w-75">Buy Now</v-btn>
      </v-card>
      <div id="text-box" class="d-flex align-center flex-column pa-4 ga-4" elevation-24>
        <h1 color="white">Max</h1>
        <h3>what's Included</h3>
        <v-divider class="w-75"></v-divider>
        <h4>unlimited recipes generations</h4>
        <h4>recipe recommendation</h4>
        <h4>Digital pantry</h4>
        <v-divider class="w-75"></v-divider>
        <h2>19.99 / month</h2>
        <v-btn class="mt-5 w-75">Buy Now</v-btn>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
  /* h2,
  h1 {
    color: #0091ea;
  } */
  #steps {
    height: 400px;
    width: 90%;
    padding-bottom: 0;
  }
  #info-text {
    font-size: 1.25em;
    line-height: 1.5;
    max-width: 800px;
    padding-left: 3rem;
    padding-right: 3rem;
  }
  #text-box {
    width: 300px;
    height: 400px;
    /* text-align: center; */
  }
  @media (max-width: 1000px) {
    #steps {
      flex-direction: column;
      font-size: 1.25em;
      line-height: 1.5;
      text-align: center;
      height: 1500px;
      justify-content: center;
      align-items: center;
    }
    #text-box {
      padding-left: 0;
      padding-right: 0;
      height: 600px;
      width: 90%;
    }
  }
  @media (max-width: 375px) {
    #steps {
      height: 800px;
    }
    #text-box {
      height: 200px;
    }
  }
</style>
