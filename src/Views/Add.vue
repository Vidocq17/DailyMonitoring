<script setup>
import { ref } from 'vue'
import DailyForm from './Add/DietForm.vue'
import WorkoutFormPPL from './Add/WorkoutFormPPL.vue'
import WorkoutFormSplit from './Add/WorkoutFormSplit.vue';
import Run from './Add/Run.vue';

const selectedTab = ref('daily')
</script>

<template>
  <div>
    <div class="flex justify-center gap-4 mb-4 overflow-x-auto">
      <button @click="selectedTab = 'daily'">Régime</button>
      <!-- <button @click="selectedTab = 'sport PPL'">Sport PPL</button> -->
      <button @click="selectedTab = 'sport Split'">Sport Split</button>
      <button @click="selectedTab = 'run'">Course</button>
    </div>

    <DailyForm v-if="selectedTab === 'daily'" />
    <WorkoutFormPPL v-if="selectedTab === 'sport PPL'" />
    <WorkoutFormSplit v-if="selectedTab === 'sport Split'" />
    <Run v-if="selectedTab === 'run'" />
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
