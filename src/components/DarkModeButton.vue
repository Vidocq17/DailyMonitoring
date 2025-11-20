<script setup lang="ts">
import { computed, watch } from 'vue'
import { useUserPrefStore } from '../store/userPrefStore'
import Moon from '../assets/svg/moon.svg'
import Sun from '../assets/svg/sun.svg'

const userPref = useUserPrefStore()

const isDark = computed({
  get: () => userPref.darkmode,
  set: (val: boolean) => {
    userPref.darkmode = val
  },
})

const applyTheme = (dark: boolean) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}

const toggle = () => {
  isDark.value = !isDark.value
}

watch(
  isDark,
  (val: boolean) => {
    applyTheme(val)
  },
  { immediate: true },
)
</script>

<template>
  <button type="button" @click="toggle" class="!p-2 !m-0">
    <img :src="isDark ? Sun : Moon" class="w-7 h-7" />
  </button>
</template>
