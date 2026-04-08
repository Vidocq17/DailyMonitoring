<script setup>
import { ref, onMounted, computed } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore'
import { useToast } from 'vue-toastification'

const store = useWorkoutStore()
const toast = useToast()
const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref('')

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
  'Élévations latérales haltères - PUSH',
  'SkullCrusher - PUSH',
  'Tractions assistées - PULL',
  'Rowing barre - PULL',
  'Tirage vertical - PULL',
  'Reverse cable - PULL',
  'Shrug haltères - PULL',
  'Curl barre EZ - PULL',
  'Curl haltères supination - PULL',
  'Grip haltères - PULL',
  'Squat barre guidée - LEGS',
  'Soulevé de terre - LEGS',
  'Presse à cuisses - LEGS',
  'Leg curl - LEGS',
  'Leg extension - LEGS',
  'Leg abduction - LEGS',
  'Leg adduction - LEGS',
  'Mollets - LEGS',
]

const labelToKey = [
  { label: 'Développé couché barre - PUSH', key: 'developpe_couche_barre' },
  { label: 'Développé incliné haltères - PUSH', key: 'developpe_incline_halteres' },
  { label: 'Développé militaire barre - PUSH', key: 'developpe_militaire_barre' },
  { label: 'Chest press machine - PUSH', key: 'chest_press_machine' },
  { label: 'Dips assistés - PUSH', key: 'dips_assistes' },
  { label: 'Élévations latérales haltères - PUSH', key: 'elevations_laterales_halteres' },
  { label: 'SkullCrusher - PUSH', key: 'skullcrusher' },

  { label: 'Tractions assistées - PULL', key: 'tractions_assistees' },
  { label: 'Rowing barre - PULL', key: 'rowing_barre' },
  { label: 'Tirage vertical - PULL', key: 'tirage_vertical_poulie' },
  { label: 'Reverse cable - PULL', key: 'reverse_cable' },
  { label: 'Shrug haltères - PULL', key: 'shrug_halteres' },
  { label: 'Curl barre EZ - PULL', key: 'curl_barre' },
  { label: 'Curl haltères supination - PULL', key: 'curl_halteres' },
  { label: 'Grip haltères - PULL', key: 'grip_halteres' },

  { label: 'Squat barre guidée - LEGS', key: 'squat_barre' },
  { label: 'Soulevé de terre - LEGS', key: 'souleve_de_terre' },
  { label: 'Presse à cuisses - LEGS', key: 'presse_a_cuisses' },
  { label: 'Leg curl - LEGS', key: 'leg_curl' },
  { label: 'Leg extension - LEGS', key: 'leg_extension' },
  { label: 'Leg abduction - LEGS', key: 'leg_abduction' },
  { label: 'Leg adduction - LEGS', key: 'leg_adduction' },
  { label: 'Mollets - LEGS', key: 'mollets' },
]

const isPasswordInvalid = computed(
  () => passwordCheck.value !== '' && passwordCheck.value !== password,
)

const isFormValid = computed(() => {
  return (
    form.value.exercise_name !== '' && form.value.weight !== '' && passwordCheck.value === password
  )
})

const resetForm = () => {
  form.value = {
    exercise_name: '',
    weight: '',
  }
}

const saveWeight = async () => {
  if (!isFormValid.value) {
    toast.error('Veuillez remplir tous les champs et saisir le mot de passe.')
    return
  }

  const exercise = labelToKey.find((item) => item.label === form.value.exercise_name)

  if (!exercise) {
    toast.error("Exercice inconnu, merci de re-sélectionner l'exercice.")
    return
  }

  try {
    await store.addWeight(exercise.key, parseFloat(form.value.weight))
    toast.success('Entrée enregistrée ✅')
    resetForm()
  } catch (err) {
    console.error(err)
    toast.error("Une erreur est survenue lors de l'enregistrement.")
  }
}
</script>

<template>
  <div class="flex flex-col items-center my-6 px-4">
    <div class="w-full max-w-3xl space-y-6">
      <!-- Titre -->
      <div class="text-center space-y-1">
        <h2 class="text-2xl font-semibold">Enregistrer vos poids</h2>
        <p class="text-sm text-[var(--color-muted)]">
          Suivez la progression de vos charges exercice par exercice.
        </p>
      </div>

      <!-- Carte formulaire -->
      <div
        class="bg-[var(--color-light)] p-6 md:p-8 rounded-2xl shadow-md border border-[var(--color-border)] space-y-6"
      >
        <!-- Mot de passe -->
        <div class="flex flex-col items-center gap-2">
          <label class="w-full max-w-xs text-sm font-medium text-left">
            Mot de passe
            <input
              type="password"
              v-model="passwordCheck"
              placeholder="••••••••"
              class="w-full mt-1"
            />
          </label>
          <p v-if="isPasswordInvalid" class="text-xs text-red-500">Mot de passe incorrect</p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="saveWeight" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex flex-col text-sm font-medium">
              Exercice
              <select v-model="form.exercise_name">
                <option value="" disabled>Sélectionner un exercice</option>
                <option v-for="ex in exercises" :key="ex" :value="ex">
                  {{ ex }}
                </option>
              </select>
            </label>

            <label class="flex flex-col text-sm font-medium">
              Poids (kg)
              <input type="number" v-model="form.weight" step="0.5" min="0" />
            </label>
          </div>

          <div class="flex justify-center pt-2">
            <button type="submit" :disabled="!isFormValid">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 600px) {
  .sport-container {
    max-width: 100vw;
    padding: 1rem;
  }
}
</style>
