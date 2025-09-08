<template>
  <nav>
    <router-link style="margin-left: 10px" to="/add">Ajouter</router-link>
    <router-link style="margin-left: 10px" to="/stats">Stats</router-link>
    <router-link style="margin-left: 10px" to="/history">Historique</router-link>
  </nav>
</template>

<style>
nav {
  background: #f8fafc;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
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
  nav a {
    margin-bottom: 8px;
  }
}
</style>
