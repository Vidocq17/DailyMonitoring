<script setup>
import { onMounted, ref } from 'vue'
import { useDailyStore } from '../store/useDailyStore'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { Line } from 'vue-chartjs'

// Enregistrement des modules nécessaires
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const store = useDailyStore()
const chartsData = ref([]) // tableau contenant toutes les données de chaque chart

const minValues = {
  poids: 85,
  kcal: 1000,
  glucides: 100,
  proteines: 80,
  lipides: 40,
  eau: 1,
  pas: 0
}

const maxValues = {
  poids: 95,
  kcal: 3000,
  glucides: 400,
  proteines: 300,
  lipides: 100,
  eau: 5,
  pas: 30000
}

// Nom + couleur pour chaque dataset
const chartConfig = [
  { key: 'poids', label: 'Poids (kg)', color: 'rgb(255, 99, 132)' },
  { key: 'kcal', label: 'Kcal', color: 'rgb(75, 192, 192)' },
  { key: 'glucides', label: 'Glucides (g)', color: 'rgb(255, 159, 64)' },
  { key: 'proteines', label: 'Protéines (g)', color: 'rgb(153, 102, 255)' },
  { key: 'lipides', label: 'Lipides (g)', color: 'rgb(54, 162, 235)' },
  { key: 'eau', label: 'Eau (L)', color: 'rgb(0, 200, 83)' },
  { key: 'pas', label: 'Pas', color: 'rgb(255, 205, 86)' }
]

onMounted(async () => {
  await store.fetchDaily()

  chartsData.value = chartConfig.map(cfg => {
    return {
      key: cfg.key,
      data: {
        labels: store.entries.map(e => e.date_du_jour),
        datasets: [
          {
            label: cfg.label,
            data: store.entries.map(e => e[cfg.key] ?? 0),
            borderColor: cfg.color,
            fill: false,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: cfg.label },
          legend: { display: false }
        },
        scales: {
          y: {
            suggestedMin: minValues[cfg.key] || 0,
            suggestedMax: maxValues[cfg.key]
          }
        }
      }
    }
  })
})
</script>

<template>
  <div style="background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 1rem;">
    <h2 style="font: bold; margin-bottom: 1rem; font-size: x-large;">Évolution quotidienne</h2>
    <div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
      <div v-for="chart in chartsData" :key="chart.key">
        <Line :data="chart.data" :options="chart.options" />
      </div>
    </div>
  </div>
</template>
