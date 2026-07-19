<script setup>
import { ref } from 'vue'
import WorkoutFormSessions from './Add/WorkoutFormSessions.vue'
import Run from './Add/Run.vue'

const selectedTab = ref('sport')
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-6 px-5 pt-4">
    <section class="space-y-1">
      <h2 class="text-2xl font-bold text-on-surface">Nouvelle séance</h2>
      <p class="text-sm text-on-surface-variant opacity-70">Enregistre ta musculation ou ta course.</p>
    </section>

    <div class="flex gap-1 rounded-xl bg-surface-container-low p-1">
      <button
        type="button"
        @click="selectedTab = 'sport'"
        class="flex-1 rounded-lg py-2 text-sm font-bold transition-colors"
        :class="selectedTab === 'sport' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'"
      >
        Musculation
      </button>
      <button
        type="button"
        @click="selectedTab = 'run'"
        class="flex-1 rounded-lg py-2 text-sm font-bold transition-colors"
        :class="selectedTab === 'run' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'"
      >
        Course
      </button>
    </div>

    <WorkoutFormSessions v-if="selectedTab === 'sport'" />
    <Run v-if="selectedTab === 'run'" />
  </main>
</template>
