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
import { color } from 'motion'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const store = useWorkoutStore()
const chartsData = ref([])

const selectedGroup = ref('PECS')

const groups = {
  PECS: [
    'Développé couché barre',
    'Développé incliné haltères',
    'Écarté à la poulie',
    'Pec deck',
  ],
  DOS: [
    'Tractions',
    'Tirage vertical',
    'Rowing barre',
    'Rowing unnilateral poulie haute',
    'Rowing unilateral haltères',
    'Rowing poitrine appuyée',
    'Tirage poulie basse',
    'Pullover câble',
    'Reverse cable crossover',
  ],
  EPAULES: [
    'Développé militaire barre',
    'Élévations latérales haltères',
    'Oiseau haltères / câble',
    'Shrug haltères',
    'Farmer Walk',
  ],
  QUADRICEPS: [
    'Squat barre',
    'Squat barre guidée',
    'Presse inclinée',
    'Fentes marchées',
    'Bulgarian split squat',
    'Leg extension',
    'Mollets',
  ],
  BICEPS: [
    'Curl incliné haltères',
    'Curl marteau haltères',
    'Curl Baleysien',
    'Curl marteau poulie',
    'Curl barre EZ',
    'Avant-bras / Grip',
  ],
  TRICEPS: [
    'Skullcrusher barre EZ',
    'Pushdown câble',
    'extension overhead',
    'Dips',
  ],
  ISCHIOS_FESSIERS: [
    'Soulevé de terre roumain',
    'Hip thrust',
    'Leg curl',
    'Abducteurs machine',
    'Adducteurs machine',
  ],
}

const exercises = [
  // PECS
  { label: 'Développé couché barre', key: 'developpe_couche_barre', color: 'rgb(239, 68, 68)' },
  { label: 'Développé incliné haltères', key: 'developpe_incline_halteres', color: 'rgb(239, 68, 68)' },
  { label: 'Écarté à la poulie', key: 'ecarte_poulie', color: 'rgb(239, 68, 68)' },
  { label: 'Pec deck', key: 'chest_press_machine', color: 'rgb(239, 68, 68)' },
  // DOS
  { label: 'Tractions', key: 'tractions_assistees', color: 'rgb(100, 100, 100)' },
  { label: 'Tirage vertical', key: 'tirage_vertical_poulie', color: 'rgb(100, 100, 100)' },
  { label: 'Rowing barre', key: 'rowing_barre', color: 'rgb(100, 100, 100)' },
  { label: 'Rowing unnilateral poulie haute', key: 'rowing_unilateral_poulie', color: 'rgb(100, 100, 100)' },
  { label: 'Rowing unilateral haltères', key: 'rowing_unilateral_halteres', color: 'rgb(100, 100, 100)' },
  { label: 'Rowing poitrine appuyée', key: 'rowing_poitrine_appuyee', color: 'rgb(100, 100, 100)' },
  { label: 'Tirage poulie basse', key: 'tirage_poulie_basse', color: 'rgb(100, 100, 100)' },
  { label: 'Pullover câble', key: 'pullover_cable', color: 'rgb(100, 100, 100)' },
  { label: 'Reverse cable crossover', key: 'reverse_cable', color: 'rgb(100, 100, 100)' },
  // EPAULES
  { label: 'Développé militaire barre', key: 'developpe_militaire_barre', color: 'rgb(255, 150, 0)' },
  { label: 'Élévations latérales haltères', key: 'elevations_laterales_halteres', color: 'rgb(255, 150, 0)' },
  { label: 'Oiseau haltères / câble', key: 'oiseau_halteres_cable', color: 'rgb(255, 150, 0)' },
  { label: 'Shrug haltères', key: 'shrug_halteres', color: 'rgb(255, 150, 0)' },
  { label: 'Farmer Walk', key: 'farmer_walk', color: 'rgb(255, 150, 0)' },
  // QUADRICEPS
  { label: 'Squat barre', key: 'squat', color: 'rgb(100, 200, 100)' },
  { label: 'Squat barre guidée', key: 'squat_barre', color: 'rgb(100, 200, 100)' },
  { label: 'Presse inclinée', key: 'presse_incline', color: 'rgb(100, 200, 100)' },
  { label: 'Fentes marchées', key: 'fentes_marchees', color: 'rgb(100, 200, 100)' },
  { label: 'Bulgarian split squat', key: 'bulgarian_split_squat', color: 'rgb(100, 200, 100)' },
  { label: 'Leg extension', key: 'leg_extension', color: 'rgb(100, 200, 100)' },
  { label: 'Mollets', key: 'mollets', color: 'rgb(100, 200, 100)' },
  // BICEPS
  { label: 'Curl incliné haltères', key: 'curl_halteres', color: 'rgb(255, 150, 255)' },
  { label: 'Curl marteau haltères', key: 'curl_marteau_halteres', color: 'rgb(255, 150, 255)' },
  { label: 'Curl Baleysien', key: 'curl_baleysien', color: 'rgb(255, 150, 255)' },
  { label: 'Curl marteau poulie', key: 'curl_marteau_poulie', color: 'rgb(255, 150, 255)' },
  { label: 'Curl barre EZ', key: 'curl_barre', color: 'rgb(255, 150, 255)' },
  { label: 'Avant-bras / Grip', key: 'grip_halteres', color: 'rgb(255, 150, 255)' },
  // TRICEPS
  { label: 'Skullcrusher barre EZ', key: 'skullcrusher', color: 'rgb(239, 68, 68)' },
  { label: 'Pushdown câble', key: 'pushdown_cable', color: 'rgb(239, 68, 68)' },
  { label: 'extension overhead', key: 'extension_overhead', color: 'rgb(239, 68, 68)' },
  { label: 'Dips', key: 'dips', color: 'rgb(239, 68, 68)' },
  // FESSIOS/ISCHIOS
  { label: 'Soulevé de terre roumain', key: 'souleve_de_terre', color: 'rgb(100, 100, 100)' },
  { label: 'Hip thrust', key: 'hip_thrust', color: 'rgb(100, 100, 100)' },
  { label: 'Leg curl', key: 'leg_curl', color: 'rgb(100, 100, 100)' },
  { label: 'Abducteurs machine', key: 'leg_abduction', color: 'rgb(100, 100, 100)' },
  { label: 'Adducteurs machine', key: 'leg_adduction', color: 'rgb(100, 100, 100)' },
]

const minValues = {
  // PECS
  developpe_couche_barre: 15,
  developpe_incline_halteres: 5,
  ecarte_poulie: 2.5,
  chest_press_machine: 10,

  // DOS
  tractions_assistees: 0,
  rowing_barre: 20,
  rowing_unilateral_halteres: 5,
  tirage_poulie_basse: 20,
  pullover_cable: 5,
  reverse_cable: 2.5,

  // EPAULES
  developpe_militaire_barre: 10,
  elevations_laterales_halteres: 2.5,
  oiseau_halteres_cable: 2.5,
  shrug_halteres: 10,
  farmer_walk: 10,

  // QUADRICEPS
  squat_barre: 20,
  presse_incline: 60,
  fentes_marchees: 0,
  leg_extension: 10,
  mollets: 0,

  // BICEPS
  curl_halteres: 2.5,
  curl_marteau_halteres: 2.5,
  curl_barre: 10,
  grip_halteres: 5,

  // TRICEPS
  skullcrusher: 5,
  pushdown_cable: 5,
  extension_overhead: 5,
  dips: 0,

  // ISCHIOS/FESSIERS
  souleve_de_terre: 20,
  hip_thrust: 20,
  leg_curl: 10,
  leg_abduction: 10,
}

const maxValues = {
  // PECS
  developpe_couche_barre: 110,
  developpe_incline_halteres: 40,
  ecarte_poulie: 40,
  chest_press_machine: 120,

  // DOS
  tractions_assistees: 80,
  rowing_barre: 100,
  rowing_unilateral_halteres: 40,
  tirage_poulie_basse: 120,
  pullover_cable: 60,
  reverse_cable: 40,

  // EPAULES
  developpe_militaire_barre: 60,
  elevations_laterales_halteres: 20,
  oiseau_halteres_cable: 25,
  shrug_halteres: 60,
  farmer_walk: 30,

  // QUADRICEPS
  squat_barre: 200,
  presse_incline: 160,
  fentes_marchees: 40,
  leg_extension: 120,
  mollets: 120,

  // BICEPS
  curl_halteres: 30,
  curl_marteau_halteres: 30,
  curl_barre: 80,
  grip_halteres: 60,

  // TRICEPS
  skullcrusher: 60,
  pushdown_cable: 30,
  extension_overhead: 30,
  dips: 50,

  // ISCHIOS/FESSIERS
  souleve_de_terre: 200,
  hip_thrust: 220,
  leg_curl: 120,
  leg_abduction: 140,
}

const groupTabs = ['PECS', 'DOS', 'EPAULES', 'QUADRICEPS', 'BICEPS', 'TRICEPS', 'ISCHIOS_FESSIERS']

const filteredCharts = computed(() =>
  chartsData.value.filter((chart) => groups[selectedGroup.value].includes(chart.label))
)

onMounted(async () => {
  await store.fetchWeights()
  await store.getBestWeight()

  chartsData.value = exercises.map((ex) => {
    const dataEntries = store.getExerciseWeights(ex.key)

    return {
      key: ex.key,
      label: ex.label,
      borderColor: ex.color ?? 'rgb(99, 102, 241)',
      backgroundColor: (ex.color ?? 'rgb(99, 102, 241)').replace('rgb', 'rgba').replace(')', ', 0.2)'),
      fill: true,
      tension: 0.25,
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
            min: minValues[ex.key] ?? 0,
            max: maxValues[ex.key] ?? 100,
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
          Visualise l’évolution de tes charges par séance.
        </p>
      </div>

      <!-- Onglets séance -->
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
          transition: transform 0.2s ease, box-shadow 0.2s ease;
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
          <span v-else class="empty">Aucune donnée</span>
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
