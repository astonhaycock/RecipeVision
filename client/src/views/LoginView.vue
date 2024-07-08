<script setup lang="ts">
</script>

<template>
  <div class="login-page">
    <h1>Login Page</h1>
    <div>
      <input placeholder="Email"/>
    </div>
    <div>
      <input placeholder="Password"/>
    </div>
    <button>Log In</button>
    <p>or</p>
    <RouterLink to="/Register">Register</RouterLink>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 400px;
  gap: 1em;
  font-size: 20px;
  
}
.login-page div {
  /* display: flex;
  justify-content: space-between;
  width: 300px; */
}
.login-page div input {
  width: 200px;
  height: 40px;
  border-radius: 5px 5px 5px 5px;
  background-color: var(--vt-c-white-mute);
}
button{
  width: 200px;
  padding: .4rem;
}
/* #newBtn{
  width: 200px;
} */
</style>
