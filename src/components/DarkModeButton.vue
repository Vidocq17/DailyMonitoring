<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Moon from '@/assets/svg/moon.svg'
import Sun from '@/assets/svg/sun.svg'
const isDark = ref(false)

const readTheme = () => document.documentElement.getAttribute('data-theme') === 'dark'
const applyTheme = (dark: boolean) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  localStorage.setItem('theme', dark ? 'dark' : 'light')
  isDark.value = dark
}

const toggle = () => applyTheme(!isDark.value)

onMounted(() => {
  isDark.value = readTheme()
})
</script>

<template>
  <div>
    <button type="button" @click="toggle" class="!p-2 !m-0 !w-full">
      <img :src="isDark ? Sun : Moon" class="w-7 h-7" />
    </button>
  </div>
</template>
