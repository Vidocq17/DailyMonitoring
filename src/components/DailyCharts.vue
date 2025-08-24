<script setup>
import { onMounted, ref } from 'vue'
import { useDailyStore } from '../store/useDailyStore'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const store = useDailyStore()
const chartData = ref(null)

onMounted(async () => {
  await store.fetchDaily()
  chartData.value = {
    labels: store.entries.map(e => e.date_du_jour),
    datasets: [
      {
        label: 'Kcal',
        data: store.entries.map(e => e.kcal),
        borderColor: 'rgb(75, 192, 192)',
        fill: false
      },
      {
        label: 'Poids (kg)',
        data: store.entries.map(e => e.poids),
        borderColor: 'rgb(255, 99, 132)',
        fill: false
      }
    ]
  }
})
</script>

<template>
  <div class="bg-white shadow p-6 rounded-xl">
    <h2 class="text-xl font-bold mb-4">Évolution</h2>
    <Line v-if="chartData" :data="chartData" />
  </div>
</template>
