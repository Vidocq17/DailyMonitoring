<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDailyStore } from '@/store/useDailyStore'
import type { DailyEntry } from '@/types'

const store = useDailyStore()

// Winter Arc : 22/09/2026 -> 22/12/2026 (3 mois pile)
const START_DATE = new Date(2026, 8, 22)
const END_DATE = new Date(2026, 11, 22)
const START_WEIGHT = 79.6

const PHRASES = [
  "Chaque kilo perdu aujourd'hui, c'est un muscle qui se voit demain.",
  'La discipline du jour construit le physique de décembre.',
  'Pas de raccourci : juste des jours validés qui s’additionnent.',
  'Le miroir ment sur le court terme, jamais sur 3 mois.',
  'Un jour manqué se rattrape. Une semaine manquée se paie.',
  'Le poids qui part ne revient pas si le muscle prend sa place.',
  "T'es pas fatigué, t'es juste à un jour du prochain palier.",
  'La graisse part la nuit, le muscle se construit le jour.',
]

onMounted(() => {
  store.fetchDaily()
})

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6

// Le week-end, la séance de sport n'est pas requise pour valider la journée
const isValidDay = (entry: DailyEntry, date: Date) =>
  (isWeekend(date) || entry.sport === true) &&
  entry.cardio === true &&
  entry.abdos === true &&
  entry.pas != null &&
  entry.kcal != null &&
  entry.eau != null &&
  entry.poids != null

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const today = new Date()

type DayCell = { date: Date; entry: DailyEntry | null; valid: boolean; tracked: boolean }

const trackedDays = computed(() => {
  const result: DayCell[] = []
  for (let d = new Date(START_DATE); d <= today; d.setDate(d.getDate() + 1)) {
    const date = new Date(d)
    const entry = store.entries.find((e) => sameDay(new Date(e.date_du_jour), date)) ?? null
    result.push({ date, entry, valid: entry ? isValidDay(entry, date) : false, tracked: true })
  }
  return result
})

const validCount = computed(() => trackedDays.value.filter((d) => d.valid).length)
const invalidCount = computed(() => trackedDays.value.length - validCount.value)

const daysRemaining = computed(() =>
  Math.max(0, Math.ceil((END_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))),
)

const sortedEntries = computed(() =>
  [...store.entries].sort((a, b) => new Date(a.date_du_jour).getTime() - new Date(b.date_du_jour).getTime()),
)
const lastWeight = computed(
  () => [...sortedEntries.value].reverse().find((e) => e.poids != null)?.poids ?? null,
)
const weightLost = computed(() => (lastWeight.value != null ? +(START_WEIGHT - lastWeight.value).toFixed(1) : null))

// Une phrase par jour, stable sur la journée (pas aléatoire à chaque render)
const motivation = computed(() => {
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24))
  return PHRASES[dayIndex % PHRASES.length]
})

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// Regroupe les jours en mois calendaires, chacun avec sa grille (cases vides
// avant le 1er, et après le début du Winter Arc / après aujourd'hui)
const months = computed(() => {
  const byKey = new Map<string, DayCell[]>()
  for (const day of trackedDays.value) {
    const key = `${day.date.getFullYear()}-${day.date.getMonth()}`
    if (!byKey.has(key)) byKey.set(key, [])
    byKey.get(key)!.push(day)
  }

  return [...byKey.entries()].map(([key, days]) => {
    const [year, month] = key.split('-').map(Number)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // 0 = lundi

    const byDate = new Map(days.map((d) => [d.date.getDate(), d]))
    const cells: (DayCell | null)[] = [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => byDate.get(i + 1) ?? null),
    ]

    const label = new Date(year, month, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

    return { key, label, cells }
  })
})
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-8 px-5 pt-4 pb-8">
    <section class="space-y-1">
      <h2 class="text-2xl font-bold text-on-surface">Winter Arc</h2>
      <p class="text-sm font-semibold uppercase tracking-wide text-on-surface-variant">
        Jusqu'au 22 décembre · {{ daysRemaining }} jours restants
      </p>
    </section>

    <!-- Compteur jours validés / non validés -->
    <section class="grid grid-cols-2 gap-3">
      <div class="flex flex-col items-center gap-1 rounded-2xl bg-emerald-500 p-5 text-white shadow-[0_4px_14px_rgba(16,185,129,0.45)]">
        <span class="text-3xl font-extrabold">{{ validCount }}</span>
        <span class="text-xs font-bold uppercase tracking-wide">Jours validés</span>
      </div>
      <div class="flex flex-col items-center gap-1 rounded-2xl bg-rose-500 p-5 text-white shadow-[0_4px_14px_rgba(244,63,94,0.4)]">
        <span class="text-3xl font-extrabold">{{ invalidCount }}</span>
        <span class="text-xs font-bold uppercase tracking-wide">Jours non validés</span>
      </div>
    </section>

    <!-- Poids perdu depuis le début -->
    <section class="flex flex-col items-center gap-1 rounded-2xl bg-white p-6 text-center ambient-shadow">
      <span class="text-xs font-bold uppercase tracking-widest text-primary">Poids perdu depuis le 22/09</span>
      <span
        v-if="weightLost !== null"
        class="text-4xl font-extrabold"
        :class="weightLost > 0 ? 'text-emerald-600' : 'text-on-surface'"
        >{{ weightLost > 0 ? '-' : '' }}{{ Math.abs(weightLost) }} <small class="text-lg font-bold">kg</small></span
      >
      <span v-else class="text-4xl font-extrabold text-on-surface-variant">--</span>
      <span class="text-xs text-on-surface-variant">{{ START_WEIGHT }} kg → {{ lastWeight ?? '--' }} kg</span>
    </section>

    <!-- Phrase motivante -->
    <section class="rounded-2xl bg-primary/10 p-5 text-center">
      <p class="text-sm font-bold italic text-primary">{{ motivation }}</p>
    </section>

    <section v-for="month in months" :key="month.key" class="space-y-3">
      <h3 class="text-base font-bold capitalize text-on-surface">{{ month.label }}</h3>

      <div class="grid grid-cols-7 gap-1.5 text-center">
        <span
          v-for="(w, i) in WEEKDAYS"
          :key="i"
          class="pb-1 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant"
          >{{ w }}</span
        >

        <div
          v-for="(cell, i) in month.cells"
          :key="i"
          class="flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl"
          :class="[
            cell === null && 'bg-transparent',
            cell && cell.valid && 'bg-emerald-500 shadow-[0_4px_14px_rgba(16,185,129,0.45)]',
            cell && !cell.valid && sameDay(cell.date, today) && 'bg-rose-500/25 ring-2 ring-rose-500',
            cell && !cell.valid && !sameDay(cell.date, today) && 'bg-rose-500 shadow-[0_4px_14px_rgba(244,63,94,0.4)]',
          ]"
        >
          <template v-if="cell">
            <span
              class="text-xs font-extrabold"
              :class="cell.valid || sameDay(cell.date, today) ? 'text-white' : 'text-white'"
              >{{ cell.date.getDate() }}</span
            >
            <span class="material-symbols-outlined filled text-[16px] text-white">{{
              cell.valid ? 'check' : 'close'
            }}</span>
          </template>
        </div>
      </div>
    </section>

    <!-- Légende -->
    <section class="flex items-center justify-center gap-6 pt-2 text-xs font-bold uppercase tracking-wide">
      <span class="flex items-center gap-2 text-emerald-600">
        <span class="h-4 w-4 rounded-md bg-emerald-500"></span>Validé
      </span>
      <span class="flex items-center gap-2 text-rose-600">
        <span class="h-4 w-4 rounded-md bg-rose-500"></span>Non validé
      </span>
    </section>

    <p v-if="trackedDays.length === 0" class="rounded-xl bg-white p-8 text-center text-sm text-on-surface-variant ambient-shadow">
      Le Winter Arc n'a pas encore commencé.
    </p>
  </main>
</template>
