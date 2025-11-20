// DarkModeButton.vue
<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useUserPrefStore } from '@/store/userPrefStore'
import Moon from '@/assets/svg/moon.svg'
import Sun from '@/assets/svg/sun.svg'

const userPref = useUserPrefStore()

const isDark = computed({
  get: () => userPref.darkmode,
  set: (val) => (userPref.darkmode = val),
})

const applyTheme = (dark: boolean) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}

const toggle = () => {
  isDark.value = !isDark.value
}

watch(
  () => isDark.value,
  (val) => {
    applyTheme(val)
  },
  { immediate: true },
)

onMounted(() => {
  // si tu veux prendre aussi en compte prefers-color-scheme au tout début,
  // seulement si rien en storage
  if (localStorage.getItem('darkmode') === null) {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    userPref.darkmode = prefersDark
  }
})
</script>

<template>
  <button type="button" @click="toggle" class="!p-2 !m-0">
    <img :src="isDark ? Sun : Moon" class="w-7 h-7" />
  </button>
</template>
