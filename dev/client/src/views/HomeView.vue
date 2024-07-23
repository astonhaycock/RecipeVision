<script setup lang="ts">
import category_cards from "../components/HomeCategory.vue";
</script>
<template>
  <div id="inner">
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
    <category_cards />
  </div>
</template>
<style>
#inner {
  max-width: 1200px;
  margin: auto;
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
}
</style>
