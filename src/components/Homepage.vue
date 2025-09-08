<template>
  <div class="home">
    <h1>Bienvenue sur Daily Monitoring</h1>
    <p>Objectif : 85 kilos !</p>
    <p v-if="lastWeight">Poids actuel : {{ lastWeight }} kg</p>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useDailyStore } from '../store/useDailyStore'

const store = useDailyStore()

onMounted(async () => {
  await store.fetchDaily()
})

const lastWeight = computed(() => store.getLastWeight())
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.home h1 {
  margin-bottom: 1rem;
}

.home p {
  margin-bottom: 2rem;
  color: #555;
}

/* Responsive */
@media (max-width: 600px) {
  .home h1 {
    font-size: 1.5rem;
  }

  .home p {
    font-size: 1rem;
  }
}
</style>
