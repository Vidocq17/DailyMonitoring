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
    'skullcrusher',
  ],
  PULL: [
    'tractions_assistees',
    'rowing_barre',
    'tirage_vertical_poulie',
    'reverse_cable',
    'shrug_halteres',
    'curl_barre',
    'curl_halteres',
    'grip_halteres',
  ],
  LEGS: [
    'squat_barre',
    'souleve_de_terre',
    'presse_a_cuisses',
    'leg_curl',
    'leg_extension',
    'leg_abduction',
    'leg_adduction',
    'mollets',
  ],
}

const exercises = [
  { key: 'developpe_couche_barre', label: 'Développé couché barre', color: 'rgb(255, 99, 132)' },
  { key: 'developpe_incline_halteres', label: 'Développé incliné haltères', color: 'rgb(75, 192, 192)' },
  { key: 'developpe_militaire_barre', label: 'Développé militaire barre', color: 'rgb(255, 159, 64)' },
  { key: 'chest_press_machine', label: 'Chest press machine', color: 'rgb(153, 102, 255)' },
  { key: 'dips_assistes', label: 'Dips assistés', color: 'rgb(54, 162, 235)' },
  { key: 'elevations_laterales_halteres', label: 'Élévations latérales haltères', color: 'rgb(255, 205, 86)' },
  { key: 'skullcrusher', label: 'SkullCrusher', color: 'rgb(255, 159, 64)' },

  { key: 'tractions_assistees', label: 'Tractions assistées', color: 'rgb(100, 150, 250)' },
  { key: 'rowing_barre', label: 'Rowing barre', color: 'rgb(200, 100, 150)' },
  { key: 'tirage_vertical_poulie', label: 'Tirage vertical poulie', color: 'rgb(150, 200, 100)' },
  { key: 'reverse_cable', label: 'Reverse cable', color: 'rgb(100, 200, 250)' },
  { key: 'shrug_halteres', label: 'Shrug haltères', color: 'rgb(250, 200, 100)' },
  { key: 'curl_barre', label: 'Curl barre EZ', color: 'rgb(50, 250, 150)' },
  { key: 'curl_halteres', label: 'Curl haltères supination', color: 'rgb(250, 150, 50)' },
  { key: 'grip_halteres', label: 'Grip haltères', color: 'rgb(150, 250, 50)' },

  { key: 'squat_barre', label: 'Squat barre guidée', color: 'rgb(150, 50, 250)' },
  { key: 'souleve_de_terre', label: 'Soulevé de terre', color: 'rgb(150, 50, 250)' },
  { key: 'presse_a_cuisses', label: 'Presse à cuisses', color: 'rgb(100, 250, 50)' },
  { key: 'leg_curl', label: 'Leg curl', color: 'rgb(150, 250, 200)' },
  { key: 'leg_extension', label: 'Leg extension', color: 'rgb(250, 100, 200)' },
  { key: 'leg_abduction', label: 'Leg abduction', color: 'rgb(100, 250, 200)' },
  { key: 'leg_adduction', label: 'Leg adduction', color: 'rgb(200, 100, 250)' },
  { key: 'mollets', label: 'Mollets', color: 'rgb(20, 50, 150)' },
]

const minValues = {
  developpe_couche_barre: 15,
  developpe_incline_halteres: 5,
  developpe_militaire_barre: 10,
  chest_press_machine: 10,
  dips_assistes: 0,
  elevations_laterales_halteres: 2.5,
  skullcrusher: 5,

  tractions_assistees: 0,
  rowing_barre: 20,
  tirage_vertical_poulie: 20,
  reverse_cable: 5,
  shrug_halteres: 10,
  curl_barre: 10,
  curl_halteres: 5,
  grip_halteres: 5,

  squat_barre: 20,
  souleve_de_terre: 40,
  presse_a_cuisses: 60,
  leg_curl: 10,
  leg_extension: 10,
  leg_abduction: 10,
  leg_adduction: 10,
  mollets: 0,
}

const maxValues = {
  developpe_couche_barre: 100,
  developpe_incline_halteres: 30,
  developpe_militaire_barre: 50,
  chest_press_machine: 60,
  dips_assistes: 60,
  elevations_laterales_halteres: 20,
  skullcrusher: 30,

  tractions_assistees: 60,
  rowing_barre: 80,
  tirage_vertical_poulie: 60,
  reverse_cable: 40,
  shrug_halteres: 30,
  curl_barre: 50,
  curl_halteres: 15,
  grip_halteres: 30,

  squat_barre: 120,
  souleve_de_terre: 120,
  presse_a_cuisses: 160,
  leg_curl: 80,
  leg_extension: 80,
  leg_abduction: 80,
  leg_adduction: 80,
  mollets: 30,
}

const groupTabs = ['PUSH', 'PULL', 'LEGS']

const filteredCharts = computed(() =>
  chartsData.value.filter((chart) => groups[selectedGroup.value].includes(chart.key)),
)

onMounted(async () => {
  await store.fetchWeights()
  await store.getBestWeight()

  chartsData.value = exercises.map((ex) => {
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
        plugins: {
          legend: { display: false },
        },
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
  <div class="my-6 mx-auto max-w-6xl p-6 md:p-8 rounded-2xl bg-[var(--color-light)] border border-[var(--color-border)]"
    style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)">
    <!-- Header -->
    <div class="charts-title flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div>
        <h2 class="text-2xl font-semibold">Progression des exercices</h2>
        <p class="text-sm text-[var(--color-muted)]">
          Visualise l’évolution de tes charges par groupe musculaire.
        </p>
      </div>

      <!-- Onglets groupe -->
      <div class="flex flex-wrap gap-2 justify-center md:justify-end">
        <button v-for="tab in groupTabs" :key="tab" type="button" @click="selectedGroup = tab" :class="[
          'px-3 py-1.5 text-xs md:text-sm rounded-full border transition !w-auto',
          selectedGroup === tab
            ? 'btn-save border-transparent'
            : 'btn-edit border-[var(--color-border)]',
        ]">
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- Grille des charts -->
    <div class="charts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="chart in filteredCharts" :key="chart.key"
        class="bg-[var(--color-surface)] rounded-2xl p-4 flex flex-col justify-between border border-[var(--color-border)]"
        style="
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          min-height: 220px;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        ">
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
          <span v-else class="empty">
            Aucune donnée
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 600px) {
  .charts-title {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
