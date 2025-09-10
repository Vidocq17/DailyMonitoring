<template>
  <div class="homepage">
    <h1>Bienvenue sur Daily Monitoring</h1>
    <p>Objectif : {{ objectif }} kilos !</p>
    <p style="font-weight: 900">Poids actuel : {{ lastWeight }} kilos !</p>
    <p style="font-weight: 900">PLUS QUE {{ reste }} 💪🏻💪🏻 !</p>
  </div>

  <div class="card flex justify-center">
    <div class="w-full bg-gray h-6 rounded-full">
      <div
        class="h-6 rounded-full transition-all duration-500"
        :style="{ width: progression + '%', backgroundColor: progressionColor }"
      ></div>
    </div>
  </div>

  <HomepageHeader />
</template>

<script setup>
import { ref } from 'vue'
import { useWeightProgress } from './composables/useWeightProgress'
import Knob from 'primevue/knob'
import HomepageHeader from '@/components/HomepageHeader.vue'

const objectif = ref(85)
const { lastWeight, reste, progression } = useWeightProgress(objectif.value)
</script>

<style scoped>
@media (max-width: 600px) {
  .homepage h1 {
    font-size: 1.5rem;
  }

  .homepage p {
    font-size: 1rem;
  }
}
</style>
