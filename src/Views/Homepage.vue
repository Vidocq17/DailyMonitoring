<template>
  <div class="max-w-4xl mx-auto my-8 px-4 space-y-6">
    <!-- Header spécifique homepage -->
    <HomepageHeader />

    <!-- Carte principale -->
    <section
      class="bg-[var(--color-light)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 text-center shadow-md"
    >
      <h1 class="text-3xl md:text-4xl font-semibold mb-2">Bienvenue sur Daily Monitoring</h1>
      <p class="text-sm text-[var(--color-muted)] mb-6">
        Suis ta progression vers ton objectif de poids au quotidien.
      </p>

      <!-- Stats rapides -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
          <p class="text-xs uppercase tracking-wide text-[var(--color-muted)] mb-1">Objectif</p>
          <p class="text-xl font-semibold">{{ objectif }}&nbsp;kg</p>
        </div>

        <div class="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
          <p class="text-xs uppercase tracking-wide text-[var(--color-muted)] mb-1">Poids actuel</p>
          <p class="text-xl font-semibold">{{ lastWeight }}&nbsp;kg</p>
        </div>

        <div class="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
          <p class="text-xs uppercase tracking-wide text-[var(--color-muted)] mb-1">
            Reste à perdre
          </p>
          <p class="text-xl font-semibold">{{ reste }}&nbsp;kg 💪🏻</p>
        </div>
      </div>

      <!-- Barre de progression simple (en attendant le Knob PrimeVue) -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs text-[var(--color-muted)]">
          <span>Progression vers l’objectif</span>
          <span>{{ progression }} %</span>
        </div>
        <div class="w-full h-3 rounded-full bg-[var(--color-secondary)] overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)] transition-all duration-500"
            :style="{ width: progression + '%' }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWeightProgress } from './composables/useWeightProgress'
import HomepageHeader from '@/components/HomepageHeader.vue'

const objectif = ref(80)
const startWeight = ref(91)
const { lastWeight, reste, progression } = useWeightProgress(objectif.value)
</script>
