import { computed, onMounted } from 'vue'
import { useDailyStore } from '@/store/useDailyStore'

export function useWeightProgress(objectif) {
  const store = useDailyStore()

  onMounted(() => {
    store.fetchDaily()
  })

  const lastWeight = computed(() => store.getLastWeight())

  const reste = computed(() => (lastWeight.value ? (lastWeight.value - objectif).toFixed(1) : null))

  const progression = computed(() =>
    lastWeight.value ? ((objectif / lastWeight.value) * 100).toFixed(1) : 0,
  )

  return { lastWeight, reste, progression }
}
