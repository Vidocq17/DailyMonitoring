<template>
  <div class="home">
    <h1>Bienvenue sur Daily Monitoring</h1>
    <p>Objectif : {{ objectif }} kilos !</p>
    <p style="font-weight: 900">Poids actuel : {{ lastWeight }} kilos !</p>
    <p style="font-weight: 900">PLUS QUE {{ reste }} 💪🏻💪🏻 !</p>
  </div>
  <div class="home-buttons">
    <router-link to="/add" class="btn">Ajouter</router-link>
    <router-link to="/stats" class="btn">Graphiques</router-link>
    <router-link to="/history" class="btn">Historique</router-link>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useDailyStore } from '../store/useDailyStore'

const objectif = ref(85)
const store = useDailyStore()

const lastWeight = ref(null)

onMounted(async () => {
  await store.fetchDaily()
  const weight = await store.getLastWeight()

  console.log('weight récupéré:', weight)

  if (weight) {
    lastWeight.value = weight
  }
})

const reste = computed(() => {
  if (lastWeight.value !== null) {
    return lastWeight.value - objectif.value
  }
  return '...'
})
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

.home-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  width: 50%;
  margin: 0 auto;
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.btn:hover {
  background-color: #357ab8;
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
