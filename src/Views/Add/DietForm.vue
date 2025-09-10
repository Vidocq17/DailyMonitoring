<script setup>
import { ref, watch } from 'vue'
import { useDailyStore } from '@/store/useDailyStore'

const store = useDailyStore()
const sportOptions = ['Push', 'Pull', 'Legs', 'Full Body', 'Cardio']
const cardioOptions = ['Course', 'Marche inclinée', 'Marche']

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

const saveEntry = async () => {
  await store.addDaily({ ...form.value })
  compareWithLastWeight()
  alert('Entrée enregistrée ✅')
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
            <input type="number" v-model="form.kcal" required />
          </label>
        </div>

        <div class="data">
          <label>
            Poids (kg)
            <input type="number" step="0.01" v-model="form.poids" required />
          </label>
        </div>

        <div class="data">
          <label>
            Pas
            <input type="number" v-model="form.pas" required />
          </label>
        </div>

        <div class="data">
          <label>
            Glucides (g)
            <input type="number" v-model="form.glucides" required />
          </label>
        </div>

        <div class="data">
          <label>
            Protéines (g)
            <input type="number" v-model="form.proteines" required />
          </label>
        </div>

        <div class="data">
          <label>
            Lipides (g)
            <input type="number" v-model="form.lipides" required />
          </label>
        </div>

        <div class="data">
          <label>
            Eau (L)
            <input type="number" step="0.1" v-model="form.eau" required />
          </label>
        </div>

        <div class="data">
          <label class="boolean-label">
            <input type="checkbox" v-model="form.sport" required />
            Sport fait ?
          </label>
        </div>

        <div class="data">
          <label>
            Séance (optionnel)
            <select v-model="form.seance" :disabled="!form.sport" required>
              <option value="" disabled>Sélectionner une séance</option>
              <option v-for="option in sportOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </label>
        </div>

        <div class="data">
          <label class="boolean-label">
            <input type="checkbox" v-model="form.cardio" required />
            Cardio fait ?
          </label>
        </div>

        <div class="data">
          <label>
            Km
            <input type="number" step="0.01" v-model="form.km" required />
          </label>
        </div>

        <div class="data">
          <label>
            Type de cardio
            <select v-model="form.typeof_cardio" :disabled="!form.cardio" required>
              <option value="" disabled>Sélectionner un type de cardio</option>
              <option v-for="option in cardioOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </label>
        </div>
      </div>

      <button @click="saveEntry">Enregistrer</button>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 600px) {
  .daily-form-data {
    grid-template-columns: repeat(1, 1fr);
    gap: 0.2rem;
  }
  label {
    display: flex;
    align-items: center;
    margin: auto;
  }
  .boolean-label {
    margin: auto;
  }
  button {
    width: 50% !important;
  }
}
</style>
