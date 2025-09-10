<script setup>
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
const chartsData = ref([])
const selectedGroup = ref('PUSH')

const groups = {
  PUSH: [
    'developpe_couche_barre',
    'developpe_incline_halteres',
    'developpe_militaire_barre',
    'chest_press_machine',
    'dips_assistes',
    'elevations_laterales_halteres',
  ],
  PULL: [
    'tractions_assistees',
    'rowing_barre',
    'tirage_vertical_poulie',
    'curl_barre',
    'curl_halteres',
  ],
  LEGS: [
    'squat_barre',
    'souleve_de_terre',
    'presse_a_cuisses',
    'fentes_halteres',
    'leg_curl',
    'mollets',
  ],
}

const exercises = [
  { key: 'developpe_couche_barre', label: 'Développé couché barre', color: 'rgb(255, 99, 132)' },
  {
    key: 'developpe_incline_halteres',
    label: 'Développé incliné haltères',
    color: 'rgb(75, 192, 192)',
  },
  {
    key: 'developpe_militaire_barre',
    label: 'Développé militaire barre',
    color: 'rgb(255, 159, 64)',
  },
  { key: 'chest_press_machine', label: 'Chest press machine', color: 'rgb(153, 102, 255)' },
  { key: 'dips_assistes', label: 'Dips assistés', color: 'rgb(54, 162, 235)' },
  {
    key: 'extensions_triceps_poulie',
    label: 'Extensions triceps poulie',
    color: 'rgb(201, 203, 207)',
  },
  {
    key: 'elevations_laterales_halteres',
    label: 'Élévations latérales haltères',
    color: 'rgb(255, 205, 86)',
  },
  { key: 'tractions_assistees', label: 'Tractions assistées', color: 'rgb(100, 150, 250)' },
  { key: 'rowing_barre', label: 'Rowing barre', color: 'rgb(200, 100, 150)' },
  { key: 'tirage_vertical_poulie', label: 'Tirage vertical poulie', color: 'rgb(150, 200, 100)' },
  { key: 'curl_barre', label: 'Curl barre supination', color: 'rgb(50, 250, 150)' },
  { key: 'curl_halteres', label: 'Curl haltères', color: 'rgb(250, 150, 50)' },
  { key: 'squat_barre', label: 'Squat barre guidée', color: 'rgb(150, 50, 250)' },
  { key: 'souleve_de_terre', label: 'Soulevé de terre', color: 'rgb(150, 50, 250)' },
  { key: 'presse_a_cuisses', label: 'Presse à cuisses', color: 'rgb(100, 250, 50)' },
  { key: 'fentes_halteres', label: 'Fentes haltères', color: 'rgb(250, 50, 100)' },
  { key: 'leg_curl', label: 'Leg curl', color: 'rgb(250, 50, 100)' },
  { key: 'mollets', label: 'Mollets', color: 'rgb(250, 50, 100)' },
]

const minValues = {
  developpe_couche_barre: 15,
  developpe_incline_halteres: 5,
  developpe_militaire_barre: 10,
  chest_press_machine: 10,
  dips_assistes: 0,
  extensions_triceps_poulie: 5,
  elevations_laterales_halteres: 2.5,
  tractions_assistees: 0,
  rowing_barre: 20,
  tirage_vertical_poulie: 20,
  curl_barre: 10,
  curl_halteres: 5,
  squat_barre: 40,
  souleve_de_terre: 40,
  presse_a_cuisses: 60,
  fentes_halteres: 0,
  leg_curl: 10,
  mollets: 0,
}

const maxValues = {
  developpe_couche_barre: 50,
  developpe_incline_halteres: 25,
  developpe_militaire_barre: 50,
  chest_press_machine: 50,
  dips_assistes: 50,
  extensions_triceps_poulie: 30,
  elevations_laterales_halteres: 20,
  tractions_assistees: 50,
  rowing_barre: 60,
  tirage_vertical_poulie: 50,
  curl_barre: 50,
  curl_halteres: 40,
  squat_barre: 100,
  souleve_de_terre: 100,
  presse_a_cuisses: 140,
  fentes_halteres: 60,
  leg_curl: 80,
  mollets: 80,
}

const filteredCharts = computed(() =>
  chartsData.value.filter((chart) => groups[selectedGroup.value].includes(chart.key)),
)

onMounted(async () => {
  await store.fetchWeights()

  chartsData.value = exercises.map((ex) => {
    const dataEntries = store.getExerciseWeights(ex.key)

    return {
      key: ex.key,
      label: ex.label,
      data: {
        labels: dataEntries.map((e) => new Date(e.created_at).toLocaleDateString()),
        datasets: [
          {
            label: ex.label,
            data: dataEntries.map((e) => e.weight),
            borderColor: ex.color,
            backgroundColor: ex.color.replace('rgb', 'rgba').replace(')', ', 0.2)'),
            fill: true,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: {
          y: {
            min: minValues[ex.key] || 0,
            max: maxValues[ex.key] || 100,
            ticks: { stepSize: 10 },
          },
        },
      },
    }
  })
})
</script>

<template>
  <div class="charts-container">
    <div class="charts-title">
      <h2>Progression des exercices</h2>
      <button @click="selectedGroup = 'PUSH'">PUSH</button>
      <button @click="selectedGroup = 'PULL'">PULL</button>
      <button @click="selectedGroup = 'LEGS'">LEGS</button>
    </div>

    <div class="charts-grid">
      <div v-for="chart in filteredCharts" :key="chart.key" class="chart-card">
        <Line :data="chart.data" :options="chart.options" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 600px) {
  .charts-title {
    flex-direction: column;
    align-items: center;
  }

  .charts-title button {
    width: 100%;
    margin: 5px 0;
  }
}
</style>
