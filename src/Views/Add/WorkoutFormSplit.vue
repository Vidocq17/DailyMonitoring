<script setup>
import { ref, computed, watch } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore'
import { useToast } from 'vue-toastification'
import { MUSCLE_GROUPS, EXERCISES_BY_GROUP, LABEL_TO_KEY } from '@/data/splitWorkoutData'

const store = useWorkoutStore()
const toast = useToast()
const errorMessage = ref(false)

const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref('')

const form = ref({
  session: '',
  exercise_name: '',
  weight: '',
})

const filteredExercises = computed(() => {
  if (!form.value.session) return []
  return EXERCISES_BY_GROUP[form.value.session] ?? []
})

watch(
  () => form.value.session,
  () => {
    form.value.exercise_name = ''
  },
)

const isPasswordInvalid = computed(
  () => passwordCheck.value !== '' && passwordCheck.value !== password,
)

const isFormValid = computed(() => {
  return (
    form.value.session !== '' &&
    form.value.exercise_name !== '' &&
    form.value.weight !== '' &&
    passwordCheck.value === password
  )
})

const resetForm = () => {
  form.value = { session: '', exercise_name: '', weight: '' }
}

const saveWeight = async () => {
  if (!isFormValid.value) {
    toast.error('Veuillez remplir tous les champs et saisir le mot de passe.')
    return
  }

  const key = LABEL_TO_KEY[form.value.exercise_name]

  if (!key) {
    toast.error("Exercice inconnu, merci de re-sélectionner l'exercice.")
    return
  }

  try {
    await store.addWeight(key, parseFloat(form.value.weight))
    toast.success('Entrée enregistrée ✅')
    resetForm()
  } catch (err) {
    console.error(err)
    toast.error("Une erreur est survenue lors de l'enregistrement.")
    errorMessage.value = true
  }
}
</script>

<template>
  <div class="flex flex-col items-center my-6 px-4">
    <div class="w-full max-w-3xl space-y-6">
      <div class="text-center space-y-1">
        <h2 class="text-2xl font-semibold">Enregistrez vos poids</h2>
        <p class="text-sm text-[var(--color-muted)]">
          Choisissez une séance puis un exercice (liste filtrée).
        </p>
      </div>

      <div class="glass-card bg-[var(--color-light)] p-6 md:p-8 rounded-2xl space-y-6">
        <div class="flex flex-col items-center gap-2">
          <label class="w-full max-w-xs text-sm font-medium text-left">
            Mot de passe
            <input type="password" v-model="passwordCheck" placeholder="••••••••" class="w-full mt-1" />
          </label>
          <p v-if="isPasswordInvalid" class="text-xs text-red-500">Mot de passe incorrect</p>
        </div>

        <form @submit.prevent="saveWeight" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex flex-col text-sm font-medium">
              Groupe musculaire
              <select v-model="form.session">
                <option value="" disabled>Sélectionner un groupe musculaire</option>
                <option v-for="group in MUSCLE_GROUPS" :key="group" :value="group">
                  {{ group }}
                </option>
              </select>
            </label>

            <label class="flex flex-col text-sm font-medium">
              Exercice
              <select v-model="form.exercise_name" :disabled="!form.session">
                <option value="" disabled>
                  {{ form.session ? "Sélectionner un exercice" : "Choisir une séance d'abord" }}
                </option>
                <option v-for="ex in filteredExercises" :key="ex" :value="ex">
                  {{ ex }}
                </option>
              </select>
            </label>

            <label class="flex flex-col text-sm font-medium md:col-span-2">
              Poids (kg)
              <input type="number" v-model="form.weight" step="0.5" min="0" />
            </label>
          </div>

          <div class="flex justify-center pt-2">
            <button type="submit" :disabled="!isFormValid">Enregistrer</button>
          </div>

          <p v-if="errorMessage" class="text-xs text-red-500">Une erreur est survenue lors de l'enregistrement.</p>
        </form>
      </div>
    </div>
  </div>
</template>
