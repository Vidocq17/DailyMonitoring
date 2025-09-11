<script setup>
import { ref } from 'vue'
import DietCharts from './Charts/DietCharts.vue'
import WorkoutCharts from './Charts/WorkoutCharts.vue'

const selectedTab = ref('daily')
</script>

<template>
  <div>
    <div class="flex justify-center gap-4 mb-4">
      <button @click="selectedTab = 'daily'">Régime</button>
      <button @click="selectedTab = 'sport'">Sport</button>
    </div>

    <DietCharts v-if="selectedTab === 'daily'" />
    <WorkoutCharts v-if="selectedTab === 'sport'" />
  </div>
</template>
