<script setup lang="ts">
  defineProps<{
    msg: string;
  }>();
</script>

<template>
  <button :id="msg">{{ msg }}</button>
</template>

<style scoped>
  button {
    border-radius: 15px 15px 15px 15px;
    width: 80px;
    border: none;
    background-color: var(--vt-c-divider-dark-2);
    color: var(--vt-c-text-dark-2);
    transition: 400ms;
  }
  button:hover {
    background-color: var(--vt-c-text-dark-2);
  }
  #Delete {
    background-color: #b52222;
  }
</style>
