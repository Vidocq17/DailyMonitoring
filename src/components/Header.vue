<script setup>
import Logo from '@/assets/img/logo.png'
</script>

<template>
  <header>
    <router-link to="/">
      <img :src="Logo" alt="Logo" style="width: 50px; height: 50px" />
    </router-link>
    <nav>
      <router-link to="/add">Ajouter</router-link>
      <router-link to="/stats">Graphiques</router-link>
      <router-link to="/history">Historique</router-link>
    </nav>
  </header>
</template>

<style scoped>
@media (max-width: 600px) {
  header {
    justify-content: space-around;
  }
  nav {
    width: 100%;
    justify-content: space-around;
    margin-top: 10px;
  }
}
</style>
