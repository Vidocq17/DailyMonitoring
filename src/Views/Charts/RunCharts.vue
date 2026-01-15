<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const store = useWorkoutStore()
const mode = ref<'duration' | 'pace' | 'distance'>('distance')

const runs = computed(() => store.runs ?? [])

const labels = computed(() =>
  runs.value.map((r) =>
    new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
  ),
)

const durationMinutes = computed(() =>
  runs.value.map((r) => Math.round((r.duration_sec / 60) * 10) / 10),
)

const paceMinPerKm = computed(() =>
  runs.value.map((r) => {
    if (!r.distance_km || r.distance_km <= 0) return null
    const secPerKm = r.duration_sec / r.distance_km
    return Math.round((secPerKm / 60) * 100) / 100
  }),
)

const distanceKm = computed(() =>
  runs.value.map((r) =>
    r.distance_km ? Math.round(r.distance_km * 100) / 100 : null,
  ),
)


const chartData = computed(() => {
  let dataset

  if (mode.value === 'duration') {
    dataset = { label: 'Durée (min)', data: durationMinutes.value }
  } else if (mode.value === 'distance') {
    dataset = { label: 'Distance (km)', data: distanceKm.value }
  } else {
    dataset = { label: 'Allure (min/km)', data: paceMinPerKm.value }
  }

  return {
    labels: labels.value,
    datasets: [
      {
        ...dataset,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.25,
        spanGaps: true,
      },
    ],
  }
})


const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: true } },
}))

onMounted(async () => {
  await store.fetchRuns()
})
</script>

<template>
  <div class="my-6 mx-auto max-w-6xl p-6 md:p-8 rounded-2xl bg-[var(--color-light)] border border-[var(--color-border)]"
    style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div>
        <h2 class="text-2xl font-semibold">Progression – Courses</h2>
        <p class="text-sm text-[var(--color-muted)]">
          Durée et allure (calculée via durée / distance).
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button type="button" @click="mode = 'distance'" :class="[
          'px-3 py-1.5 text-xs md:text-sm rounded-full border transition !w-auto',
          mode === 'distance'
            ? 'btn-save border-transparent'
            : 'btn-edit border-[var(--color-border)]',
        ]">
          Distance
        </button>
        <button type="button" @click="mode = 'duration'" :class="[
          'px-3 py-1.5 text-xs md:text-sm rounded-full border transition !w-auto',
          mode === 'duration' ? 'btn-save border-transparent' : 'btn-edit border-[var(--color-border)]',
        ]">
          Durée
        </button>
        <button type="button" @click="mode = 'pace'" :class="[
          'px-3 py-1.5 text-xs md:text-sm rounded-full border transition !w-auto',
          mode === 'pace' ? 'btn-save border-transparent' : 'btn-edit border-[var(--color-border)]',
        ]">
          Allure
        </button>

      </div>
    </div>

    <div class="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)]"
      style="min-height: 320px">
      <div v-if="runs.length" class="h-72">
        <Line :data="chartData" :options="chartOptions" />
      </div>

      <div v-else class="h-72 flex items-center justify-center text-sm text-[var(--color-muted)]">
        Aucune course enregistrée pour le moment.
      </div>

      <p v-if="mode === 'pace'" class="text-xs text-[var(--color-muted)] mt-3">
        Astuce : l’allure est calculée automatiquement via durée / distance.
      </p>
    </div>
  </div>
</template>
