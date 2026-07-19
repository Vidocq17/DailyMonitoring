<script setup lang="ts">
const items = [
  { to: '/', icon: 'home', label: 'Accueil' },
  { to: '/add', icon: 'edit_note', label: 'Journal' },
  { to: '/workout', icon: 'fitness_center', label: 'Sport' },
  { to: '/history', icon: 'history', label: 'Historique' },
  { to: '/stats', icon: 'monitoring', label: 'Stats' },
]
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around bg-surface px-4 py-2 pb-safe shadow-[0px_-4px_20px_rgba(45,55,72,0.05)]"
  >
    <router-link
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1 text-on-surface-variant transition-all duration-200 active-scale hover:text-primary"
      exact-active-class="!bg-primary-fixed/40 !text-primary"
    >
      <span class="material-symbols-outlined text-[22px]" :class="{ filled: $route.path === item.to }">{{
        item.icon
      }}</span>
      <span class="text-[11px] font-semibold">{{ item.label }}</span>
    </router-link>
  </nav>
</template>
