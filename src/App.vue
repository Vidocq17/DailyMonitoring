<template>
  <div id="app">
    <Header v-if="$route.name !== 'Home'" />
    <router-view />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'

// TODO : REfacto tout le style en tailwindcss - FAIT
// TODO : Darkode - FAIT
// TODO : Notifications
// TODO : Passer en Typescript
// TODO : Framer motion
// TODO : Filtres sur l'historique
// TODO : Améliorer le design
// TODO : Barre de progression vers l’objectif de poids => Knob primevue
</script>
