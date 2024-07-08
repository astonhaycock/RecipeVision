<script setup lang="ts">
import icon from "./icons/IconUpload.vue";
</script>

<template>
  <div id="img-container">
    <h2>Upload Photo of Ingredients</h2>
    <div id="img-box">
      <icon />
      <div>
        <input type="file" id="actual-btn" hidden />
        <label for="actual-btn">Choose File</label>
        <button type="submit">Upload Ingredients</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#img-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* border: white solid; */
  background-color: var(--vt-c-divider-dark-2);
  color: var(--vt-c-white-mute);
  padding: 3rem;
  padding-left: 8rem;
  padding-right: 8rem;
}
#img-box svg {
  width: 500px;
  height: auto;
  /* color: var(--vt-c-white-mute); */
}
#img-box div {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
}
button,
label {
  border-radius: 15px 15px 15px 15px;
  width: 150px;
  height: 60px;
  border: none;
  background-color: var(--vt-c-divider-dark-2);
  /* color: var(--vt-c-text-dark-2); */
  color: var(--vt-c-white-mute);
  transition: 400ms;
}
button:hover,
label:hover {
  background-color: var(--vt-c-text-dark-2);
}
label {
  padding: 1rem;
}
@media (max-width: 1200px) {
  #img-container {
    /* border: white solid; */
    background-color: var(--vt-c-divider-dark-2);
    color: var(--vt-c-white-mute);
    padding: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    align-items: center;
    justify-content: flex-start;
  }
  #img-box svg {
    width: 400px;
    height: auto;
    /* color: var(--vt-c-white-mute); */
  }
  #img-box div {
    gap: 1rem;
  }
  button,
  label {
    border-radius: 15px 15px 15px 15px;
    width: 75px;
    height: 50px;
    border: none;
    background-color: var(--vt-c-divider-dark-2);
    /* color: var(--vt-c-text-dark-2); */
    color: var(--vt-c-white-mute);
    transition: 400ms;
  }
  label {
    padding: 0rem;
  }
}
</style>
