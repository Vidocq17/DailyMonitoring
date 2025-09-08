<script setup>
import Logo from '@/img/logo.png'
</script>

<template>
  <header>
    <router-link to="/">
      <img :src="Logo" alt="Logo" style="width: 50px; height: 50px" />
    </router-link>
    <nav>
      <router-link to="/add">Ajouter</router-link>
      <router-link to="/stats">Stats</router-link>
      <router-link to="/history">Historique</router-link>
    </nav>
  </header>
</template>

<style>
header {
  background: #f8fafc;
  padding: 5px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
nav {
  background: #f8fafc;
  padding: 5px;
  display: flex;
  justify-content: space-around;
}

nav a {
  color: #2563eb;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
}

nav a:hover {
  background: #e0e7ff;
}

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
