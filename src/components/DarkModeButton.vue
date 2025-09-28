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
</script>
