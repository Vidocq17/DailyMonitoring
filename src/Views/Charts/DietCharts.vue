<script setup>
import { onMounted, ref } from 'vue'
import { useDailyStore } from '../../store/useDailyStore'
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

// Enregistrement des modules nécessaires
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const store = useDailyStore()
const chartsData = ref([]) // tableau contenant toutes les données de chaque chart

const minValues = {
  poids: 86,
  kcal: 1500,
  glucides: 100,
  proteines: 100,
  lipides: 40,
  eau: 1,
  pas: 0,
}

const maxValues = {
  poids: 92,
  kcal: 2600,
  glucides: 300,
  proteines: 200,
  lipides: 100,
  eau: 5,
  pas: 30000,
}

// Nom + couleur pour chaque dataset
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

  // 🔹 Tri par défaut des entrées (du plus récent au plus ancien)
  const sortedEntries = [...store.entries].sort(
    (a, b) => new Date(a.date_du_jour) - new Date(b.date_du_jour),
  )

  chartsData.value = chartConfig.map((cfg) => {
    return {
      key: cfg.key,
      data: {
        labels: sortedEntries.map((e) => e.date_du_jour),
        datasets: [
          {
            label: cfg.label,
            data: sortedEntries.map((e) => e[cfg.key] ?? 0),
            borderColor: cfg.color,
            backgroundColor: cfg.color.replace('rgb', 'rgba').replace(')', ', 0.2)'),
            fill: true,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: cfg.label, font: { size: 16 } },
          legend: { display: false },
        },
        scales: {
          y: {
            suggestedMin: minValues[cfg.key] || 0,
            suggestedMax: maxValues[cfg.key],
          },
        },
      },
    }
  })
})
</script>

<template>
  <div class="charts-container">
    <h2>Évolution quotidienne</h2>
    <div class="charts-grid">
      <div v-for="chart in chartsData" :key="chart.key" class="chart-card">
        <Line :data="chart.data" :options="chart.options" />
      </div>
    </div>
  </div>
</template>
