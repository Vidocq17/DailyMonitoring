<script setup>
import { ref, onMounted } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore'

const store = useWorkoutStore()

const form = ref({
  exercise_name: '',
  weight: '',
})

const exercises = [
  'Développé couché barre - PUSH',
  'Développé incliné haltères - PUSH',
  'Développé militaire barre - PUSH',
  'Chest press machine - PUSH',
  'Dips assistés - PUSH',
  'Extensions triceps poulie - PUSH',
  'Élévations latérales haltères - PUSH',
  'Tractions assistées - PULL',
  'Rowing barre - PULL',
  'Tirage vertical - PULL',
  'Soulevé de terre - PULL',
  'Curl barre EZ - PULL',
  'Curl haltères supination - PULL',
  'Squat barre guidée - LEGS',
  'Presse à cuisses - LEGS',
  'Fentes marchées haltères - LEGS',
  'Hip Thrust - LEGS',
  'Leg curl - LEGS',
  'Mollets - LEGS',
]

const labelToKey = [
  { label: 'Développé couché barre', key: 'developpe_couche_barre' },
  { label: 'Développé incliné haltères', key: 'developpe_incline_halteres' },
  { label: 'Développé militaire barre', key: 'developpe_militaire_barre' },
  { label: 'Chest press machine', key: 'chest_press_machine' },
  { label: 'Dips assistés', key: 'dips_assistes' },
  { label: 'Extensions triceps poulie', key: 'extensions_triceps_poulie' },
  { label: 'Élévations latérales haltères', key: 'elevations_laterales_halteres' },
  { label: 'Tractions assistées', key: 'tractions_assistees' },
  { label: 'Rowing barre', key: 'rowing_barre' },
  { label: 'Tirage vertical', key: 'tirage_vertical_poulie' },
  { label: 'Soulevé de terre', key: 'souleve_de_terre' },
  { label: 'Curl barre EZ', key: 'curl_barre' },
  { label: 'Curl haltères supination', key: 'curl_halteres' },
  { label: 'Squat barre guidée', key: 'squat_barre' },
  { label: 'Presse à cuisses', key: 'presse_a_cuisses' },
  { label: 'Fentes marchées haltères', key: 'fentes_halteres' },
  { label: 'Hip Thrust', key: 'hip_thrust' },
  { label: 'Leg curl', key: 'leg_curl' },
  { label: 'Mollets', key: 'mollets' },
]

const saveWeight = async () => {
  if (!form.value.exercise_name || !form.value.weight) {
    alert('Remplis tous les champs !')
    return
  }
  await store.addWeight(
    labelToKey.find((item) => item.label === form.value.exercise_name)?.key,
    parseFloat(form.value.weight),
  )
  alert('Poids enregistré ✅')
}

onMounted(() => {
  store.fetchWeights()
})
</script>

<template>
  <div class="sport-container w-10/12 mx-auto p-8 text-center">
    <h2>Enregistrer vos poids</h2>

    <form>
      <label>
        Exercice
        <select v-model="form.exercise_name">
          <option value="" disabled>Sélectionner un exercice</option>
          <option v-for="ex in exercises" :key="ex" :value="ex">{{ ex }}</option>
        </select>
      </label>

      <label>
        Poids (kg)
        <input type="number" v-model="form.weight" step="0.5" />
      </label>

      <button @click="saveWeight">Enregistrer</button>
    </form>

    <h3>Historique des poids</h3>
    <table>
      <thead>
        <tr>
          <th>Exercice</th>
          <th>Poids (kg)</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in store.entries" :key="entry.id">
          <td>{{ entry.exercise_name }}</td>
          <td>{{ entry.weight }}</td>
          <td>{{ new Date(entry.created_at).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@media (max-width: 600px) {
  form {
    flex-direction: column;
    align-items: center;
  }

  input,
  select {
    width: 100%;
  }
  .sport-container {
    max-width: 100vw;
    padding: 1rem;
  }
}
</style>
