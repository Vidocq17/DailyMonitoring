import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

function usePersistentRef(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  let parsed

  try {
    parsed = storedValue !== null ? JSON.parse(storedValue) : defaultValue
  } catch {
    parsed = defaultValue
  }

  const state = ref(parsed)

  watch(
    state,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true },
  )

  return state
}

// Le store Pinia
export const useUserPrefStore = defineStore('userPref', () => {
  const darkmode = usePersistentRef('darkmode', false)

  return {
    darkmode,
  }
})
