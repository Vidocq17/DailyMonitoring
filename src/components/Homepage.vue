<template>
  <div class="home">
    <h1>Bienvenue sur Daily Monitoring</h1>
    <p>Objectif : 85 kilos !</p>
    <p style="font-weight: 900">Poids actuel : 89 kilos !</p>
    <p style="font-weight: 900">PLUS QUE 4 !</p>
    <p v-if="lastWeight">Poids actuel : {{ lastWeight }} kg</p>
  </div>
  <div class="home-buttons">
    <router-link to="/add" class="btn">Ajouter</router-link>
    <router-link to="/stats" class="btn">Graphiques</router-link>
    <router-link to="/history" class="btn">Historique</router-link>
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
