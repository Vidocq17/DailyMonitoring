<script setup>
import { ref } from 'vue'
import DailyForm from './Add/DietForm.vue'
import WorkoutForm from './Add/WorkoutForm.vue'

const selectedTab = ref('daily')
</script>

<template>
  <div>
    <div class="select-button">
      <button @click="selectedTab = 'daily'">Régime</button>
      <button @click="selectedTab = 'sport'">Sport</button>
    </div>

    <DailyForm v-if="selectedTab === 'daily'" />
    <WorkoutForm v-if="selectedTab === 'sport'" />
  </div>
</template>

<style scoped>
@media (max-width: 600px) {
  .form {
    flex-direction: column;
    align-items: center;
  }

  input,
  select {
    width: 100%;
  }
}
</style>
