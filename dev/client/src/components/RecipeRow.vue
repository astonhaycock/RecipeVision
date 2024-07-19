<script setup lang="ts"></script>

<template>
  <v-sheet class="mx-auto pa-2" color="grey-lighten-4">
    <v-sheet
      color="grey-lighten-2"
      height="24"
      rounded="pill"
      width="88"
    ></v-sheet>

    <v-slide-group show-arrows>
      <v-slide-group-item v-for="n in 5" :key="n">
        <v-sheet
          class="ma-3"
          color="grey-lighten-1"
          height="200"
          width="250"
          rounded
        ></v-sheet>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>
