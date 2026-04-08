import { defineStore } from 'pinia'
import { shallowRef, watch, type ShallowRef } from 'vue'

function usePersistentRef<T>(key: string, defaultValue: T): ShallowRef<T> {
  const storedValue = localStorage.getItem(key)
  let parsed: T

  try {
    parsed = storedValue ? (JSON.parse(storedValue) as T) : defaultValue
  } catch {
    parsed = defaultValue
  }

  const state = shallowRef<T>(parsed)

  watch(state, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  })

  return state
}

export const useUserPrefStore = defineStore('userPref', () => {
  const darkmode = usePersistentRef<boolean>('darkmode', false)

  return {
    darkmode,
  }
})
