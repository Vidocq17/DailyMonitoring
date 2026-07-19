<script setup lang="ts">
import Logo from '@/assets/img/logo.png'
import DarkModeButton from './DarkModeButton.vue'
</script>

<template>
  <header
    class="sticky top-0 z-40 flex w-full max-w-full items-center justify-between bg-background/80 px-5 py-4 backdrop-blur-md"
  >
    <router-link to="/" class="flex items-center gap-3 active-scale">
      <span class="h-10 w-10 overflow-hidden rounded-full bg-surface-container">
        <img :src="Logo" alt="Daily Monitoring" class="h-full w-full object-cover" />
      </span>
      <h1 class="font-sans text-lg font-extrabold text-primary">Daily Monitoring</h1>
    </router-link>

    <DarkModeButton
      class="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-transform active-scale hover:opacity-80"
    />
  </header>
</template>
