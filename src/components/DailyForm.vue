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
  seance: '',
})

const saveEntry = async () => {
  await store.addDaily({ ...form.value })
  alert('Entrée enregistrée ✅')
}
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: center;
      align-items: center;
    "
  >
    <h2 style="font: bold; margin-bottom: 1rem; font-size: x-large">Nouvelle entrée</h2>
    <div>
      <div class="div">
        <label>
          Date
          <input type="date" v-model="form.date_du_jour" class="input" />
        </label>
      </div>

      <div class="div">
        <label>
          Kcal
          <input type="number" v-model="form.kcal" class="input" />
        </label>
      </div>

      <div class="div">
        <label>
          Glucides (g)
          <input type="number" v-model="form.glucides" class="input" />
        </label>
      </div>

      <div class="div">
        <label>
          Lipides (g)
          <input type="number" v-model="form.lipides" class="input" />
        </label>
      </div>

      <div class="div">
        <label>
          Protéines (g)
          <input type="number" v-model="form.proteines" class="input" />
        </label>
      </div>

      <div class="div">
        <label>
          Pas
          <input type="number" v-model="form.pas" class="input" />
        </label>
      </div>

      <div class="div">
        <label>
          Eau (L)
          <input type="number" step="0.1" v-model="form.eau" class="input" />
        </label>
      </div>

      <div class="div">
        <label>
          Poids (kg)
          <input type="number" step="0.01" v-model="form.poids" class="input"
        /></label>
      </div>

      <div class="div">
        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="form.sport" />
          Sport fait ?
        </label>
      </div>

      <div class="div">
        <label>
          Séance (optionnel)
          <textarea v-model="form.seance" class="input"></textarea>
        </label>
      </div>

      <button @click="saveEntry" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Enregistrer
      </button>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply border rounded px-2 py-1 w-full;
}
.input {
  border: 1px solid black;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  width: 50%;
}
label {
  display: flex;
  flex-direction: column;
  margin: 1rem;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}
</style>
