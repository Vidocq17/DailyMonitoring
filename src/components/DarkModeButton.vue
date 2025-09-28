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

<!-- 

<script setup>
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserPrefStore } from '@/store/userPrefStore'

import Moon from '@/assets/svg/moon.svg'
import Sun from '@/assets/svg/sun.svg'

const userPref = useUserPrefStore()

// ✅ storeToRefs permet de rendre darkmode modifiable localement
const { darkmode: isDark } = storeToRefs(userPref)

const applyTheme = (dark) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}

onMounted(() => {
  applyTheme(isDark.value)
})

watch(isDark, (newVal) => {
  applyTheme(newVal)
})

const toggle = () => {
  isDark.value = !isDark.value
}
</script> -->
