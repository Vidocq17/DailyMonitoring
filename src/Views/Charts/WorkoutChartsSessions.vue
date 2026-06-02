<script setup>
import { onMounted, ref, computed } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore.ts'
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
import { SESSIONS, EXERCISES_BY_SESSION } from '@/data/sessionsWorkoutData'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const store = useWorkoutStore()
const chartsData = ref([])
const selectedGroup = ref('PUSH')

const SESSION_COLORS = {
  PUSH: 'rgb(239, 68, 68)',
  PULL: 'rgb(100, 116, 139)',
  LEGS: 'rgb(100, 200, 100)',
  UPPER: 'rgb(255, 150, 0)',
  LOWER: 'rgb(168, 85, 247)',
}

// To avoid duplicates overall if we need a flat list, we could use a Map, but it's better to just build charts based on the selected group.

const filteredCharts = computed(() => {
  const sessionExercises = EXERCISES_BY_SESSION[selectedGroup.value] || []
  
  // Deduplicate exercises by key (in case an exercise is added twice in the same session, though unlikely)
  const uniqueKeys = new Set()
  const uniqueExercises = []
  
  for (const ex of sessionExercises) {
    if (!uniqueKeys.has(ex.key)) {
      uniqueKeys.add(ex.key)
      uniqueExercises.push(ex)
    }
  }

  const color = SESSION_COLORS[selectedGroup.value] || 'rgb(100, 100, 100)'

  return uniqueExercises.map((ex) => {
    const dataEntries = store.getExerciseWeights(ex.key)

    return {
      key: ex.key,
      label: ex.label,
      data: {
        labels: dataEntries.map((e) =>
          new Date(e.created_at).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
          }),
        ),
        datasets: [
          {
            label: ex.label,
            data: dataEntries.map((e) => e.weight),
            borderColor: color,
            backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.2)'),
            fill: true,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 10 },
          },
        },
      },
    }
  })
})

onMounted(async () => {
  await store.fetchWeights()
})
</script>

<template>
  <div class="glass-card my-6 mx-auto max-w-6xl p-6 md:p-8 rounded-2xl bg-[var(--color-light)] shadow-md border border-[var(--color-border)]">
    <!-- Header -->
    <div class="charts-title flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div>
        <h2 class="text-2xl font-semibold">Progression des exercices (Séances)</h2>
        <p class="text-sm text-[var(--color-muted)]">
          Visualise l'évolution de tes charges pour ce programme.
        </p>
      </div>

      <!-- Onglets séance -->
      <div class="flex flex-wrap gap-2 justify-center md:justify-end">
        <button
          v-for="tab in SESSIONS"
          :key="tab"
          type="button"
          @click="selectedGroup = tab"
          :class="[
            'px-3 py-1.5 text-xs md:text-sm rounded-full border transition !w-auto',
            selectedGroup === tab
              ? 'btn-save border-transparent'
              : 'btn-edit border-[var(--color-border)]',
          ]"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Grille des charts -->
    <div class="charts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="chart in filteredCharts"
        :key="chart.key"
        class="glass-card bg-[var(--color-surface)] rounded-2xl p-4 flex flex-col justify-between border border-[var(--color-border)]"
        style="min-height: 220px"
      >
        <h3 class="text-sm font-semibold mb-2 text-[var(--color-text)]">
          {{ chart.label }}
        </h3>

        <div class="h-40">
          <Line :data="chart.data" :options="chart.options" />
        </div>

        <div class="mt-4 text-center text-sm">
          <strong>Meilleure performance :</strong>
          <span v-if="store.getBestWeight(chart.key) !== null">
            {{ store.getBestWeight(chart.key) }} kg
          </span>
          <span v-else class="empty text-[var(--color-muted)]">Aucune donnée</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
