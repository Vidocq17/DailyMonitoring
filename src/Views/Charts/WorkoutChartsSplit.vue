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

// ✅ Nouveau : sélection par séance (au lieu de PUSH/PULL/LEGS)
const selectedGroup = ref('PECS')

/**
 * ✅ Groupes = séances
 * Doit matcher les keys créées dans ta page “enregistrer”.
 */
const groups = {
  PECS: [
    'developpe_couche_barre',
    'developpe_incline_halteres',
    'dips_assistes',
    'ecarte_poulie',
    'pushdown_cable',
    'chest_press_machine',
  ],
  DOS: [
    'tractions_assistees',
    'rowing_barre',
    'tirage_poulie_basse',
    'pullover_cable',
    'reverse_cable',
  ],
  EPAULES: [
    'developpe_militaire_barre',
    'elevations_laterales_halteres',
    'oiseau_halteres_cable',
    'shrug_halteres',
  ],
  QUADRICEPS: [
    'squat_barre',
    'fentes_marchees',
    'leg_extension',
    'mollets_debout_presse',
  ],
  BRAS: [
    'curl_barre',
    'curl_halteres',
    'skullcrusher',
    'pushdown_cable',
    'grip_halteres',
  ],
  'ISCHIOS/FESSIERS': [
    'souleve_de_terre',
    'hip_thrust',
    'leg_curl',
    'leg_abduction',
    'mollets_assis',
  ],
}

/**
 * ✅ Liste des exercices affichables
 * key = clé DB (store.getExerciseWeights / store.getBestWeight)
 */
const exercises = [
  // PECS
  { key: 'developpe_couche_barre', label: 'Développé couché barre', color: 'rgb(255, 99, 132)' },
  { key: 'developpe_incline_halteres', label: 'Développé incliné haltères', color: 'rgb(75, 192, 192)' },
  { key: 'dips_assistes', label: 'Dips', color: 'rgb(54, 162, 235)' },
  { key: 'ecarte_poulie', label: 'Écarté à la poulie', color: 'rgb(255, 205, 86)' },
  { key: 'pushdown_cable', label: 'Pushdown câble', color: 'rgb(153, 102, 255)' },
  { key: 'chest_press_machine', label: 'Pec deck', color: 'rgb(255, 159, 64)' },

  // DOS
  { key: 'tractions_assistees', label: 'Tractions assistées / Tirage vertical', color: 'rgb(100, 150, 250)' },
  { key: 'rowing_barre', label: 'Rowing barre', color: 'rgb(200, 100, 150)' },
  { key: 'tirage_poulie_basse', label: 'Tirage poulie basse', color: 'rgb(150, 200, 100)' },
  { key: 'pullover_cable', label: 'Pullover câble', color: 'rgb(100, 200, 250)' },
  { key: 'reverse_cable', label: 'Reverse cable crossover', color: 'rgb(250, 200, 100)' },

  // EPAULES
  { key: 'developpe_militaire_barre', label: 'Développé militaire barre', color: 'rgb(255, 159, 64)' },
  { key: 'elevations_laterales_halteres', label: 'Élévations latérales haltères', color: 'rgb(255, 205, 86)' },
  { key: 'oiseau_halteres_cable', label: 'Oiseau haltères / câble', color: 'rgb(80, 180, 140)' },
  { key: 'shrug_halteres', label: 'Shrug haltères', color: 'rgb(20, 120, 200)' },

  // QUADRICEPS
  { key: 'squat_barre', label: 'Squat barre guidée / Presse', color: 'rgb(150, 50, 250)' },
  { key: 'fentes_marchees', label: 'Fentes marchées', color: 'rgb(250, 100, 200)' },
  { key: 'leg_extension', label: 'Leg extension', color: 'rgb(100, 250, 200)' },
  { key: 'mollets_debout_presse', label: 'Mollets debout / presse', color: 'rgb(20, 50, 150)' },

  // BRAS
  { key: 'curl_barre', label: 'Curl barre EZ', color: 'rgb(50, 250, 150)' },
  { key: 'curl_halteres', label: 'Curl incliné haltères', color: 'rgb(250, 150, 50)' },
  { key: 'skullcrusher', label: 'Skullcrusher barre EZ', color: 'rgb(255, 99, 132)' },
  { key: 'grip_halteres', label: 'Avant-bras / Grip', color: 'rgb(150, 250, 50)' },

  // ISCHIOS/FESSIERS
  { key: 'souleve_de_terre', label: 'Soulevé de terre roumain', color: 'rgb(120, 80, 200)' },
  { key: 'hip_thrust', label: 'Hip thrust', color: 'rgb(255, 120, 80)' },
  { key: 'leg_curl', label: 'Leg curl', color: 'rgb(150, 250, 200)' },
  { key: 'leg_abduction', label: 'Abducteurs machine', color: 'rgb(80, 200, 160)' },
  { key: 'mollets_assis', label: 'Mollets assis', color: 'rgb(60, 60, 140)' },
]

/**
 * ✅ Planchers / plafonds (à ajuster selon tes charges)
 * Important : si tu veux, on peut retirer complètement min/max et laisser ChartJS auto-scale.
 */
const minValues = {
  // PECS
  developpe_couche_barre: 15,
  developpe_incline_halteres: 5,
  dips: 0,
  ecarte_poulie: 2.5,
  pushdown_cable: 5,
  chest_press_machine: 10,

  // DOS
  tractions_assistees: 0,
  rowing_barre: 20,
  tirage_poulie_basse: 20,
  pullover_cable: 5,
  reverse_cable: 2.5,

  // EPAULES
  developpe_militaire_barre: 10,
  elevations_laterales_halteres: 2.5,
  oiseau_halteres_cable: 2.5,
  shrug_halteres: 10,

  // QUADRICEPS
  squat_barre: 20,
  fentes_marchees: 0,
  leg_extension: 10,
  mollets_debout_presse: 0,

  // BRAS
  curl_barre: 10,
  curl_halteres: 2.5,
  skullcrusher: 5,
  grip_halteres: 5,

  // ISCHIOS/FESSIERS
  souleve_de_terre: 20,
  hip_thrust: 20,
  leg_curl: 10,
  leg_abduction: 10,
  mollets_assis: 0,
}

const maxValues = {
  // PECS
  developpe_couche_barre: 110,
  developpe_incline_halteres: 40,
  dips: 80,
  ecarte_poulie: 40,
  pushdown_cable: 60,
  chest_press_machine: 120,

  // DOS
  tractions_assistees: 80,
  rowing_barre: 120,
  tirage_poulie_basse: 120,
  pullover_cable: 60,
  reverse_cable: 40,

  // EPAULES
  developpe_militaire_barre: 60,
  elevations_laterales_halteres: 25,
  oiseau_halteres_cable: 25,
  shrug_halteres: 60,

  // QUADRICEPS
  squat_barre: 200,
  fentes_marchees: 40,
  leg_extension: 120,
  mollets_debout_presse: 120,

  // BRAS
  curl_barre: 80,
  curl_halteres: 30,
  skullcrusher: 60,
  grip_halteres: 60,

  // ISCHIOS/FESSIERS
  souleve_de_terre: 200,
  hip_thrust: 220,
  leg_curl: 120,
  leg_abduction: 140,
  mollets_assis: 120,
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
