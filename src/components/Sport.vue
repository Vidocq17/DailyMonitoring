<script setup>
import { ref, onMounted } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore'

const store = useWorkoutStore()

const form = ref({
  exercise_name: '',
  weight: '',
})

// Exemple d'exercices Push / Pull / Legs
const exercises = [
  'Développé couché barre',
  'Développé incliné haltères',
  'Développé militaire barre',
  'Chest press machine',
  'Dips assistés',
  'Extensions triceps poulie',
  'Élévations latérales haltères',
  'Tractions assistées',
  'Rowing barre',
  'Tirage vertical',
  'Soulevé de terre',
  'Curl barre EZ',
  'Curl haltères supination',
  'Squat barre guidée',
  'Presse à cuisses',
  'Fentes marchées haltères',
  'Hip Thrust',
  'Leg curl',
  'Mollets',
]

const saveWeight = async () => {
  if (!form.value.exercise_name || !form.value.weight) {
    alert('Remplis tous les champs !')
    return
  }
  await store.addWeight({ ...form.value })
  form.value.weight = ''
  alert('Poids enregistré ✅')
}

onMounted(() => {
  store.fetchWeights()
})
</script>

<template>
  <div class="container">
    <h2>Enregistrer vos poids</h2>

    <div class="form">
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
    </div>

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
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h2,
h3 {
  color: #333;
  margin-bottom: 1rem;
}

.form {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
}

.form label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
}

input,
select {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #aaa;
  width: 200px;
}

button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #357ab8;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.6rem;
  text-align: center;
}

th {
  background-color: #f3f3f3;
}

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
