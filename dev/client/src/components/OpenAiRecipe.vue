<script setup lang="ts">
  import { defineComponent } from "vue";
  import DefaultButton from "../components/DefaultButton.vue";
</script>
<script lang="ts">
  export default defineComponent({
    data() {
      return {};
    },
    methods: {},
    computed: {},
  });
</script>
<template>
  <div id="page">
    <div class="login-page">
      <DefaultButton id="getBtn" msg="Generate new recipe" />
    </div>
  </div>
</template>

<style scoped>
  #page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #getBtn {
    width: 150px;
    height: 70px;
    font-size: large;
  }
</style>
