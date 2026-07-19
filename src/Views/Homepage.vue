<template>
  <main class="mx-auto max-w-2xl space-y-8 px-5 pt-4">
    <!-- Titre + date -->
    <section class="space-y-1">
      <h2 class="text-2xl font-bold text-on-surface">Vue d'ensemble</h2>
      <p class="text-sm font-semibold uppercase tracking-wide text-on-surface-variant">{{ formattedDate }}</p>
    </section>

    <!-- Hero poids -->
    <section
      class="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-white p-6 text-center ambient-shadow"
    >
      <span class="material-symbols-outlined absolute right-3 top-3 text-[80px] text-primary opacity-10"
        >monitor_weight</span
      >
      <span class="text-xs font-bold uppercase tracking-widest text-primary">Poids actuel</span>
      <div class="mt-1 flex items-baseline gap-1">
        <span class="text-4xl font-extrabold text-on-surface">{{ lastWeight ?? '--' }}</span>
        <span class="text-lg font-semibold text-on-surface-variant">kg</span>
      </div>
      <div
        v-if="weightTrend !== null"
        class="mt-2 flex items-center gap-1 text-sm font-semibold"
        :class="weightTrend <= 0 ? 'text-secondary' : 'text-error'"
      >
        <span class="material-symbols-outlined text-[16px]">{{
          weightTrend <= 0 ? 'trending_down' : 'trending_up'
        }}</span>
        <span>{{ weightTrend > 0 ? '+' : '' }}{{ weightTrend }} kg depuis la dernière entrée</span>
      </div>
      <p class="mt-3 text-xs text-on-surface-variant">
        Objectif {{ objectif }} kg · reste {{ reste ?? '--' }} kg
      </p>
      <div class="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-surface-container">
        <div
          class="h-full rounded-full bg-gradient-to-r from-secondary-fixed-dim to-primary transition-all duration-500"
          :style="{ width: progression + '%' }"
        ></div>
      </div>
    </section>

    <!-- Bento grid -->
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-3 rounded-xl bg-white p-5 ambient-shadow">
        <div class="flex items-start justify-between">
          <span class="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">Calories</span>
          <span class="material-symbols-outlined text-[#F59E0B]">local_fire_department</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-bold text-on-surface">{{ lastEntry?.kcal ?? '--' }}</span>
          <span class="text-[11px] text-on-surface-variant">kcal aujourd'hui</span>
        </div>
      </div>

      <div class="flex flex-col gap-3 rounded-xl bg-white p-5 ambient-shadow">
        <div class="flex items-start justify-between">
          <span class="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">Hydratation</span>
          <span class="material-symbols-outlined text-blue-500">water_drop</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-bold text-on-surface">{{ lastEntry?.eau ?? '--' }}</span>
          <span class="text-[11px] text-on-surface-variant">litres</span>
        </div>
      </div>

      <div class="flex flex-col gap-3 rounded-xl bg-white p-5 ambient-shadow">
        <div class="flex items-start justify-between">
          <span class="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">Pas</span>
          <span class="material-symbols-outlined text-secondary">directions_walk</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-bold text-on-surface">{{ lastEntry?.pas ?? '--' }}</span>
          <span class="text-[11px] text-on-surface-variant">pas aujourd'hui</span>
        </div>
      </div>

      <div class="flex flex-col gap-2 rounded-xl bg-white p-5 ambient-shadow">
        <span class="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">Macros (g)</span>
        <div class="flex flex-col gap-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-on-surface-variant">Glucides</span>
            <span class="font-semibold text-on-surface">{{ lastEntry?.glucides ?? '--' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-on-surface-variant">Protéines</span>
            <span class="font-semibold text-on-surface">{{ lastEntry?.proteines ?? '--' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-on-surface-variant">Lipides</span>
            <span class="font-semibold text-on-surface">{{ lastEntry?.lipides ?? '--' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Activités du jour -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-on-surface">Dernière entrée</h3>
        <router-link to="/history" class="text-sm font-bold text-primary">Voir tout</router-link>
      </div>
      <div v-if="lastEntry" class="overflow-hidden rounded-xl bg-white ambient-shadow">
        <div class="flex items-center justify-between border-b border-surface-container p-5">
          <div class="flex items-center gap-4">
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full"
              :class="lastEntry.sport ? 'bg-secondary/10 text-secondary' : 'bg-surface-container text-outline'"
            >
              <span class="material-symbols-outlined">fitness_center</span>
            </span>
            <div>
              <p class="font-bold text-on-surface">Sport{{ lastEntry.seance ? ` · ${lastEntry.seance}` : '' }}</p>
              <p class="text-xs text-on-surface-variant">{{ lastEntry.sport ? 'Séance effectuée' : 'Pas de sport' }}</p>
            </div>
          </div>
          <span
            class="material-symbols-outlined"
            :class="lastEntry.sport ? 'filled text-secondary' : 'text-outline-variant'"
            >{{ lastEntry.sport ? 'check_circle' : 'radio_button_unchecked' }}</span
          >
        </div>
        <div class="flex items-center justify-between border-b border-surface-container p-5">
          <div class="flex items-center gap-4">
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full"
              :class="lastEntry.cardio ? 'bg-primary/10 text-primary' : 'bg-surface-container text-outline'"
            >
              <span class="material-symbols-outlined">directions_run</span>
            </span>
            <div>
              <p class="font-bold text-on-surface">
                Cardio{{ lastEntry.cardio ? ` · ${lastEntry.typeof_cardio ?? ''} ${lastEntry.km ?? ''}km` : '' }}
              </p>
              <p class="text-xs text-on-surface-variant">{{ lastEntry.cardio ? 'Effectué' : 'Pas de cardio' }}</p>
            </div>
          </div>
          <span
            class="material-symbols-outlined"
            :class="lastEntry.cardio ? 'filled text-secondary' : 'text-outline-variant'"
            >{{ lastEntry.cardio ? 'check_circle' : 'radio_button_unchecked' }}</span
          >
        </div>
        <div class="flex items-center justify-between p-5">
          <div class="flex items-center gap-4">
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full"
              :class="lastEntry.abdos ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container text-outline'"
            >
              <span class="material-symbols-outlined">self_improvement</span>
            </span>
            <div>
              <p class="font-bold text-on-surface">Abdos</p>
              <p class="text-xs text-on-surface-variant">{{ lastEntry.abdos ? 'Effectués' : 'Pas fait' }}</p>
            </div>
          </div>
          <span
            class="material-symbols-outlined"
            :class="lastEntry.abdos ? 'filled text-secondary' : 'text-outline-variant'"
            >{{ lastEntry.abdos ? 'check_circle' : 'radio_button_unchecked' }}</span
          >
        </div>
      </div>
      <div v-else class="rounded-xl bg-white p-6 text-center text-sm text-on-surface-variant ambient-shadow">
        Aucune entrée pour l'instant.
        <router-link to="/add" class="font-bold text-primary">Ajouter ta première entrée</router-link>
      </div>
    </section>

    xd
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDailyStore } from '@/store/useDailyStore'

const store = useDailyStore()
const objectif = ref(75)

onMounted(() => {
  store.fetchDaily()
})

const sortedEntries = computed(() =>
  [...store.entries].sort((a, b) => new Date(a.date_du_jour) - new Date(b.date_du_jour)),
)

const lastEntry = computed(() => sortedEntries.value[sortedEntries.value.length - 1] ?? null)
const previousEntry = computed(() => sortedEntries.value[sortedEntries.value.length - 2] ?? null)

const lastWeight = computed(() => lastEntry.value?.poids ?? null)

const weightTrend = computed(() => {
  if (!lastEntry.value || !previousEntry.value) return null
  return +(lastEntry.value.poids - previousEntry.value.poids).toFixed(1)
})

const reste = computed(() => (lastWeight.value ? +(lastWeight.value - objectif.value).toFixed(1) : null))

const progression = computed(() => {
  if (!lastWeight.value) return 0
  const pct = (objectif.value / lastWeight.value) * 100
  return Math.min(100, Math.max(0, +pct.toFixed(1)))
})

// Données du mini-graphique "Progression du poids" : on prend les 14
// dernières entrées qui ont un poids renseigné, et on transforme chaque
// poids en hauteur de barre en % (entre 15% et 100%) relative au min/max
// de la période affichée — c'est une échelle relative, pas absolue,
// juste pour visualiser la tendance en un coup d'œil.
const weightChart = computed(() => {
  const last = sortedEntries.value.slice(-14).filter((e) => typeof e.poids === 'number')
  if (last.length < 2) return null

  const weights = last.map((e) => e.poids)
  const min = Math.min(...weights)
  const max = Math.max(...weights)
  const range = max - min || 1
  const bars = weights.map((w) => 15 + ((w - min) / range) * 85)

  const shortDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  return {
    bars,
    weights,
    min,
    max,
    firstDate: shortDate(last[0].date_du_jour),
    lastDate: shortDate(last[last.length - 1].date_du_jour),
  }
})

const formattedDate = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
</script>
