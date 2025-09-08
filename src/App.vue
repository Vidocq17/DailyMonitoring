<template>
  <div id="app">
    <Header v-if="$route.name !== 'Home'" />
    <router-view />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
</script>
