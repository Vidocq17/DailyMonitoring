<script setup>
import { ref } from 'vue'
import DietCharts from './Charts/DietCharts.vue'
import WorkoutChartsPPL from './Charts/WorkoutChartsPPL.vue'
import WorkoutChartsSplit from './Charts/WorkoutChartsSplit.vue';
import WorkoutChartsSessions from './Charts/WorkoutChartsSessions.vue';
import RunCharts from './Charts/RunCharts.vue';

const selectedTab = ref('daily')
</script>

<template>
  <div>
    <div class="flex justify-center gap-4 mb-4">
      <button class="legacy-btn" @click="selectedTab = 'daily'">Régime</button>
      <!-- <button @click="selectedTab = 'sport'">Sport PPL</button> -->
      <!-- <button @click="selectedTab = 'sportSplit'">Sport Split</button> -->
      <button class="legacy-btn" @click="selectedTab = 'sportSessions'">Sport Séances</button>
      <button class="legacy-btn" @click="selectedTab = 'run'">Course</button>
    </div>

    <DietCharts v-if="selectedTab === 'daily'" />
    <WorkoutChartsPPL v-if="selectedTab === 'sport'" />
    <WorkoutChartsSplit v-if="selectedTab === 'sportSplit'" />
    <WorkoutChartsSessions v-if="selectedTab === 'sportSessions'" />
    <RunCharts v-if="selectedTab === 'run'" />
  </div>
</template>
