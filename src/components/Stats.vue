<script setup>
import { ref } from 'vue'
import DietCharts from './Charts/DietCharts.vue'
import WorkoutCharts from './Charts/WorkoutCharts.vue'

const selectedTab = ref('daily')
</script>

<template>
  <div>
    <div class="select-button">
      <button @click="selectedTab = 'daily'">Régime</button>
      <button @click="selectedTab = 'sport'">Sport</button>
    </div>

    <DietCharts v-if="selectedTab === 'daily'" />
    <WorkoutCharts v-if="selectedTab === 'sport'" />
  </div>
</template>

<style scoped>
.select-button {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
button {
  background: linear-gradient(to right, #3b82f6, #2563eb);
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s;
  width: 30%;
}
</style>
