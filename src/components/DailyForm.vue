<script setup>
import { ref } from 'vue'
import { useDailyStore } from '../store/useDailyStore'

const store = useDailyStore()

const form = ref({
  date_du_jour: new Date().toISOString().split('T')[0],
  kcal: '',
  glucides: '',
  lipides: '',
  proteines: '',
  pas: '',
  eau: '',
  poids: '',
  sport: false,
  seance: ''
})

const saveEntry = async () => {
  await store.addDaily({ ...form.value })
  alert('Entrée enregistrée ✅')
}
</script>

<template>
  <div class="bg-white shadow p-6 rounded-xl space-y-4">
    <h2 class="text-xl font-bold">Nouvelle entrée</h2>
    <div class="grid grid-cols-2 gap-4">
      <label>Date <input type="date" v-model="form.date_du_jour" class="input" /></label>
      <label>Kcal <input type="number" v-model="form.kcal" class="input" /></label>
      <label>Glucides (g) <input type="number" v-model="form.glucides" class="input" /></label>
      <label>Lipides (g) <input type="number" v-model="form.lipides" class="input" /></label>
      <label>Protéines (g) <input type="number" v-model="form.proteines" class="input" /></label>
      <label>Pas <input type="number" v-model="form.pas" class="input" /></label>
      <label>Eau (L) <input type="number" step="0.1" v-model="form.eau" class="input" /></label>
      <label>Poids (kg) <input type="number" step="0.01" v-model="form.poids" class="input" /></label>
    </div>
    <label class="flex items-center gap-2">
      <input type="checkbox" v-model="form.sport" />
      Sport fait ?
    </label>
    <label>Séance (optionnel) <textarea v-model="form.seance" class="input"></textarea></label>
    <button @click="saveEntry" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Enregistrer</button>
  </div>
</template>

<style scoped>
.input {
  @apply border rounded px-2 py-1 w-full;
}
</style>
