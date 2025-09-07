<template>
  <nav>
    <router-link style="margin-left: 10px" to="/">Accueil</router-link>
    <router-link style="margin-left: 10px" to="/add">Ajouter</router-link>
    <router-link style="margin-left: 10px" to="/stats">Stats</router-link>
    <router-link style="margin-left: 10px" to="/history">Historique</router-link>
    <router-link style="margin-left: 10px" to="/sport">Sport</router-link>
    <router-link style="margin-left: 10px" to="/workout-stats">Stats d'entraînement</router-link>
  </nav>
</template>

<style>
nav {
  background: #f8fafc;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
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
</style>
