<script setup>
import { ref } from 'vue'
import DietCharts from './Charts/DietCharts.vue'
import WorkoutChartsPPL from './Charts/WorkoutChartsPPL.vue'
import WorkoutChartsSplit from './Charts/WorkoutChartsSplit.vue';
import RunCharts from './Charts/RunCharts.vue';

const selectedTab = ref('daily')
</script>

<template>
  <div>
    <div class="flex justify-center gap-4 mb-4">
      <button @click="selectedTab = 'daily'">Régime</button>
      <button @click="selectedTab = 'sport'">Sport PPL</button>
      <button @click="selectedTab = 'sportSplit'">Sport Split</button>
      <button @click="selectedTab = 'run'">Course</button>
    </div>

    <DietCharts v-if="selectedTab === 'daily'" />
    <WorkoutChartsPPL v-if="selectedTab === 'sport'" />
    <WorkoutChartsSplit v-if="selectedTab === 'sportSplit'" />
    <RunCharts v-if="selectedTab === 'run'" />
  </div>
</template>
