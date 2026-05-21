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
import { MUSCLE_GROUPS, EXERCISES, EXERCISES_BY_GROUP, GROUP_COLORS } from '@/data/splitWorkoutData'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const store = useWorkoutStore()
const chartsData = ref([])
const selectedGroup = ref('PECS')

const filteredCharts = computed(() =>
  chartsData.value.filter((chart) =>
    EXERCISES_BY_GROUP[selectedGroup.value].includes(chart.label),
  ),
)

onMounted(async () => {
  await store.fetchWeights()
  await store.getBestWeight()

  chartsData.value = EXERCISES.map((ex) => {
    const color = GROUP_COLORS[ex.group]
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
            min: ex.min,
            max: ex.max,
            ticks: { stepSize: 10 },
          },
        },
      },
    }
  })
})
</script>

<template>
  <div class="glass-card my-6 mx-auto max-w-6xl p-6 md:p-8 rounded-2xl bg-[var(--color-light)]">
    <!-- Header -->
    <div class="charts-title flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div>
        <h2 class="text-2xl font-semibold">Progression des exercices</h2>
        <p class="text-sm text-[var(--color-muted)]">
          Visualise l'évolution de tes charges par séance.
        </p>
      </div>

      <!-- Onglets séance -->
      <div class="flex flex-wrap gap-2 justify-center md:justify-end">
        <button
          v-for="tab in MUSCLE_GROUPS"
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
        class="glass-card bg-[var(--color-surface)] rounded-2xl p-4 flex flex-col justify-between"
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
          <span v-else class="empty">Aucune donnée</span>
        </div>
      </div>
    </div>
  </div>
</template>
