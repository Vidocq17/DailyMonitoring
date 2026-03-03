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

const selectedGroup = ref('PECS')

const groups = {
  PECS: [
    'Développé couché barre',
    'Développé incliné haltères',
    'Écarté à la poulie',
    'Pec deck',
  ],
  DOS: [
    'Tractions assistées / Tirage vertical',
    'Rowing barre',
    'Rowing unilateral haltères',
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
    'Curl barre EZ',
    'Avant-bras / Grip',
  ],
  TRICEPS: [
    'Skullcrusher barre EZ',
    'Pushdown câble',
    'extension overhead',
    'Dips',
  ],
  'ISCHIOS/FESSIERS': [
    'Soulevé de terre roumain',
    'Hip thrust',
    'Leg curl',
    'Abducteurs machine',
  ],
}

const exercises = [
  // PECS
  { label: 'Développé couché barre', key: 'developpe_couche_barre' },
  { label: 'Développé incliné haltères', key: 'developpe_incline_halteres' },
  { label: 'Écarté à la poulie', key: 'ecarte_poulie' },
  { label: 'Pec deck', key: 'chest_press_machine' },
// DOS
  { label: 'Tractions assistées / Tirage vertical', key: 'tractions_assistees' },
  { label: 'Rowing barre', key: 'rowing_barre' },
  { label: 'Rowing unilateral haltères', key: 'rowing_unilateral_halteres' },
  { label: 'Tirage poulie basse', key: 'tirage_poulie_basse' },
  { label: 'Pullover câble', key: 'pullover_cable' },
  { label: 'Reverse cable crossover', key: 'reverse_cable' },
// EPAULES
  { label: 'Développé militaire barre', key: 'developpe_militaire_barre' },
  { label: 'Élévations latérales haltères', key: 'elevations_laterales_halteres' },
  { label: 'Oiseau haltères / câble', key: 'oiseau_halteres_cable' },
  { label: 'Shrug haltères', key: 'shrug_halteres' },
  { label: 'Farmer Walk', key: 'farmer_walk' },
// QUADRICEPS
  { label: 'Squat barre guidée', key: 'squat_barre' },
  { label: 'Presse inclinée', key: 'presse_incline' },
  { label: 'Fentes marchées', key: 'fentes_marchees' },
  { label: 'Bulgarian split squat', key: 'bulgarian_split_squat' },
  { label: 'Leg extension', key: 'leg_extension' },
  { label: 'Mollets', key: 'mollets' },
// BICEPS
  { label: 'Curl incliné haltères', key: 'curl_halteres' },
  { label: 'Curl marteau haltères', key: 'curl_marteau_halteres' },
  { label: 'Curl barre EZ', key: 'curl_barre' },
  { label: 'Avant-bras / Grip', key: 'grip_halteres' },
// TRICEPS
  { label: 'Skullcrusher barre EZ', key: 'skullcrusher' },
  { label: 'Pushdown câble', key: 'pushdown_cable' },
  { label: 'extension overhead', key: 'extension_overhead' },
  { label: 'Dips', key: 'dips' },
// FESSIOS/ISCHIOS
  { label: 'Soulevé de terre roumain', key: 'souleve_de_terre' },
  { label: 'Hip thrust', key: 'hip_thrust' },
  { label: 'Leg curl', key: 'leg_curl' },
  { label: 'Abducteurs machine', key: 'leg_abduction' },
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
  fentes_marchees: 0,
  leg_extension: 10,
  mollets: 0,

  // BRAS
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
  fentes_marchees: 40,
  leg_extension: 120,
  mollets: 120,

  // BRAS
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

const groupTabs = ['PECS', 'DOS', 'EPAULES', 'QUADRICEPS', 'BRAS', 'ISCHIOS/FESSIERS']

const filteredCharts = computed(() =>
  chartsData.value.filter((chart) => (groups[selectedGroup.value] ?? []).includes(chart.key)),
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
  <div
    class="my-6 mx-auto max-w-6xl p-6 md:p-8 rounded-2xl bg-[var(--color-light)] border border-[var(--color-border)]"
    style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)"
  >
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
        <button
          v-for="tab in groupTabs"
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
        class="bg-[var(--color-surface)] rounded-2xl p-4 flex flex-col justify-between border border-[var(--color-border)]"
        style="
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          min-height: 220px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        "
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

<style scoped>
@media (max-width: 600px) {
  .charts-title {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
