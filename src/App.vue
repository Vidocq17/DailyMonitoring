<template>
  <div id="app">
    <Header v-if="$route.name !== 'Home'" />
    <RouterView v-slot="{ Component }">
      <div v-motion :initial="{ opacity: 0, x: 50 }" :enter="{ opacity: 1, x: 0 }" :leave="{ opacity: 0, x: -50 }"
        transition="{ duration: 0.4 }">
        <component :is="Component" />
      </div>
    </RouterView>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'

// TODO : REfacto tout le style en tailwindcss - FAIT
// TODO : Darkode - FAIT
// TODO : Notifications - FAIT
// TODO : Passer en Typescript - FAIT
// TODO : Framer motion - FAIT
// TODO : Refaire le darkmodeButton avec le store en parenthèse et corriger les erreurs - FAIT
// TODO : Filtres sur l'historique - FAIT
// TODO : Améliorer le design
// TODO : Barre de progression vers l’objectif de poids => Knob primevue
// TODO : Passer en offline pour les charts
</script>
