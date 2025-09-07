<script setup>
import { ref, watch } from 'vue'
import { useDailyStore } from '@/store/useDailyStore'

import bigLooser from '@/img/big_looser.PNG'
import leanWinner from '@/img/lean_winner.JPG'

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
  cardio: false,
  km: '',
  typeof_cardio: '',
})

const sportOptions = ['Push', 'Pull', 'Legs', 'Full Body', 'Cardio']
const cardioOptions = ['Course', 'Marche inclinée', 'Marche']

// Image affichée après comparaison
const weightImage = ref(null)

const saveEntry = async () => {
  await store.addDaily({ ...form.value })
  compareWithLastWeight()
  alert('Entrée enregistrée ✅')
}

const compareWithLastWeight = () => {
  const lastWeight = store.getLastWeight()
  if (lastWeight !== null && form.value.poids) {
    const diff = form.value.poids - lastWeight
    if (diff > 0) {
      weightImage.value = bigLooser
    } else if (diff < 0) {
      weightImage.value = leanWinner
    } else {
      weightImage.value = null
    }
  }
}

watch(
  () => form.value.poids,
  () => {
    compareWithLastWeight()
  },
)
</script>

<template>
  <div class="container">
    <h2>Nouvelle entrée</h2>
    <div class="daily-form">
      <div class="daily-form-data">
        <div class="data">
          <label>
            Kcal
            <input type="number" v-model="form.kcal" class="input" />
          </label>
        </div>

        <div class="data">
          <label>
            Poids (kg)
            <input type="number" step="0.01" v-model="form.poids" class="input" />
          </label>
        </div>

        <div class="data">
          <label>
            Pas
            <input type="number" v-model="form.pas" class="input" />
          </label>
        </div>

        <div class="data">
          <label>
            Glucides (g)
            <input type="number" v-model="form.glucides" class="input" />
          </label>
        </div>

        <div class="data">
          <label>
            Protéines (g)
            <input type="number" v-model="form.proteines" class="input" />
          </label>
        </div>

        <div class="data">
          <label>
            Lipides (g)
            <input type="number" v-model="form.lipides" class="input" />
          </label>
        </div>

        <div class="data">
          <label>
            Eau (L)
            <input type="number" step="0.1" v-model="form.eau" class="input" />
          </label>
        </div>

        <div class="data">
          <label
            style="
              flex-direction: row;
              align-items: center;
              gap: 0.6rem;
              margin: auto 105px auto auto;
            "
          >
            <input type="checkbox" v-model="form.sport" />
            Sport fait ?
          </label>
        </div>

        <div class="data">
          <label>
            Séance (optionnel)
            <select v-model="form.seance" class="input" :disabled="!form.sport">
              <option value="" disabled>Sélectionner une séance</option>
              <option v-for="option in sportOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </label>
        </div>

        <div class="data">
          <label
            style="
              flex-direction: row;
              align-items: center;
              gap: 0.6rem;
              margin: auto 105px auto auto;
            "
          >
            <input type="checkbox" v-model="form.cardio" />
            Cardio fait ?
          </label>
        </div>

        <div class="data">
          <label>
            Km
            <input type="number" step="0.01" v-model="form.km" class="input" />
          </label>
        </div>

        <div class="data">
          <label>
            Type de cardio
            <select v-model="form.typeof_cardio" class="input" :disabled="!form.cardio">
              <option value="" disabled>Sélectionner un type de cardio</option>
              <option v-for="option in cardioOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </label>
        </div>
      </div>

      <button @click="saveEntry">Enregistrer</button>

      <!-- 🔹 Image affichée selon comparaison -->
      <div v-if="weightImage" class="result-img">
        <img :src="weightImage" alt="Résultat comparaison poids" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  color: #2563eb;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.daily-form {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.daily-form-data {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.data {
  margin: 0.8rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 0.6rem;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 5px rgba(37, 99, 235, 0.3);
  outline: none;
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

button:hover {
  background: linear-gradient(to right, #2563eb, #1e40af);
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.boolean-label {
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;
}

.result-img {
  margin-top: 1.5rem;
  text-align: center;
}

.result-img img {
  max-width: 200px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
