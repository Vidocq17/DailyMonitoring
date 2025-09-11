<template>
  <div class="text-center p-8 max-w-[800px] mx-auto">
    <h1>Bienvenue sur Daily Monitoring</h1>
    <p>Objectif : {{ objectif }} kilos !</p>
    <p style="font-weight: 900">Poids actuel : {{ lastWeight }} kilos !</p>
    <p style="font-weight: 900">PLUS QUE {{ reste }} 💪🏻💪🏻 !</p>
  </div>
  <HomepageHeader />
</template>

<script setup>
import { ref } from 'vue'
import { useWeightProgress } from './composables/useWeightProgress'
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
