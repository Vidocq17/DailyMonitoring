<script setup>
import { onMounted, ref } from 'vue'
import { useDailyStore } from '@/store/useDailyStore'
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

const store = useDailyStore()
const chartsData = ref([])
const isLoading = ref(true)

const minValues = {
  poids: 86,
  kcal: 1500,
  glucides: 100,
  proteines: 100,
  lipides: 40,
  eau: 1,
  pas: 3000,
}

const maxValues = {
  poids: 91,
  kcal: 2600,
  glucides: 300,
  proteines: 200,
  lipides: 160,
  eau: 4,
  pas: 21000,
}

const chartConfig = [
  { key: 'poids', label: 'Poids (kg)', color: 'rgb(255, 99, 132)' },
  { key: 'kcal', label: 'Kcal', color: 'rgb(75, 192, 192)' },
  { key: 'glucides', label: 'Glucides (g)', color: 'rgb(255, 159, 64)' },
  { key: 'proteines', label: 'Protéines (g)', color: 'rgb(153, 102, 255)' },
  { key: 'lipides', label: 'Lipides (g)', color: 'rgb(54, 162, 235)' },
  { key: 'eau', label: 'Eau (L)', color: 'rgb(0, 200, 83)' },
  { key: 'pas', label: 'Pas', color: 'rgb(255, 205, 86)' },
]

onMounted(async () => {
  await store.fetchDaily()

  const sortedEntries = [...store.entries].sort(
    (a, b) => new Date(a.date_du_jour) - new Date(b.date_du_jour),
  )

  const labels = sortedEntries.map((e) =>
    new Date(e.date_du_jour).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
    }),
  )

  chartsData.value = chartConfig.map((cfg) => {
    const values = sortedEntries.map((e) => Number(e[cfg.key] ?? 0))

    return {
      key: cfg.key,
      label: cfg.label,
      data: {
        labels,
        datasets: [
          {
            label: cfg.label,
            data: values,
            borderColor: cfg.color,
            backgroundColor: cfg.color.replace('rgb', 'rgba').replace(')', ', 0.2)'),
            fill: true,
            tension: 0.25,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: false,
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${cfg.label} : ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 0,
            },
          },
          y: {
            suggestedMin: minValues[cfg.key] ?? 0,
            suggestedMax: maxValues[cfg.key] ?? undefined,
          },
        },
      },
    }
  })

  isLoading.value = false
})
</script>

<template>
  <div
    class="my-6 mx-auto max-w-6xl p-6 md:p-8 rounded-2xl bg-[var(--color-light)] border border-[var(--color-border)]"
    style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)"
  >
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
      <div>
        <h2 class="text-2xl font-semibold text-center md:text-left">Évolution quotidienne</h2>
        <p class="text-sm text-[var(--color-muted)] text-center md:text-left">
          Visualise la progression de ton poids, de tes calories et de tes macros jour après jour.
        </p>
      </div>

      <div class="flex flex-wrap gap-2 justify-center md:justify-end charts-title w-full">
        <button type="button" class="btn-save text-xs md:text-sm" style="width: auto">
          Derniers {{ store.entries.length || 0 }} jours
        </button>
      </div>
    </div>

    <!-- État loading -->
    <div v-if="isLoading" class="text-center py-10 text-sm text-[var(--color-muted)]">
      Chargement des données…
    </div>

    <!-- État vide -->
    <div
      v-else-if="!store.entries.length"
      class="text-center py-10 text-sm text-[var(--color-muted)]"
    >
      Aucune donnée disponible pour le moment. Ajoute une première entrée quotidienne pour voir tes
      graphiques ici.
    </div>

    <!-- Grille des charts -->
    <div v-else class="charts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="chart in chartsData"
        :key="chart.key"
        class="bg-[var(--color-surface)] rounded-2xl p-4 flex flex-col gap-2 border border-[var(--color-border)]"
        style="
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        "
      >
        <div class="flex items-center justify-between mb-1">
          <h3 class="text-sm font-semibold">{{ chart.label }}</h3>
        </div>

        <Line :data="chart.data" :options="chart.options" />
      </div>
    </div>
  </div>
</template>
