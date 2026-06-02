<script setup>
import { ref, computed, watch } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore'
import { useToast } from 'vue-toastification'
import { SESSIONS, EXERCISES_BY_SESSION, SESSION_LABEL_TO_KEY } from '@/data/sessionsWorkoutData'

const store = useWorkoutStore()
const toast = useToast()
const errorMessage = ref(false)
const hasSubmitted = ref(false)

const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref('')

const form = ref({
  session: '',
  exercise_name: '',
  weight: '',
})

const filteredExercises = computed(() => {
  if (!form.value.session) return []
  return EXERCISES_BY_SESSION[form.value.session]?.map(e => e.label) ?? []
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
  hasSubmitted.value = false
}

const saveWeight = async () => {
  hasSubmitted.value = true
  if (!isFormValid.value) {
    toast.error('Veuillez remplir tous les champs et saisir le mot de passe.')
    return
  }

  const key = SESSION_LABEL_TO_KEY[form.value.exercise_name]

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
        <h2 class="text-2xl font-semibold">Enregistrez vos poids (Séances)</h2>
        <p class="text-sm text-[var(--color-muted)]">
          Choisissez une séance puis un exercice pour enregistrer vos performances.
        </p>
      </div>

      <div class="glass-card bg-[var(--color-light)] p-6 md:p-8 rounded-2xl space-y-6 shadow-md border border-[var(--color-border)]">
        <div class="flex flex-col items-center gap-2">
          <label class="w-full max-w-xs text-sm font-medium text-left">
            Mot de passe
            <input type="password" v-model="passwordCheck" placeholder="••••••••" class="w-full mt-1" :class="{'border-red-500': hasSubmitted && passwordCheck !== password}" />
          </label>
          <p v-if="isPasswordInvalid || (hasSubmitted && passwordCheck === '')" class="text-xs text-red-500">Mot de passe manquant ou incorrect</p>
        </div>

        <form @submit.prevent="saveWeight" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex flex-col text-sm font-medium">
              Séance
              <select v-model="form.session" :class="{'border-red-500': hasSubmitted && form.session === ''}">
                <option value="" disabled>Sélectionner une séance</option>
                <option v-for="session in SESSIONS" :key="session" :value="session">
                  {{ session }}
                </option>
              </select>
              <span v-if="hasSubmitted && form.session === ''" class="text-xs text-red-500 mt-1">Requis</span>
            </label>

            <label class="flex flex-col text-sm font-medium">
              Exercice
              <select v-model="form.exercise_name" :disabled="!form.session" :class="{'border-red-500': hasSubmitted && form.exercise_name === ''}">
                <option value="" disabled>
                  {{ form.session ? "Sélectionner un exercice" : "Choisir une séance d'abord" }}
                </option>
                <option v-for="ex in filteredExercises" :key="ex" :value="ex">
                  {{ ex }}
                </option>
              </select>
              <span v-if="hasSubmitted && form.exercise_name === ''" class="text-xs text-red-500 mt-1">Requis</span>
            </label>

            <label class="flex flex-col text-sm font-medium md:col-span-2">
              Poids (kg)
              <input type="number" v-model="form.weight" step="0.5" min="0" :class="{'border-red-500': hasSubmitted && form.weight === ''}" />
              <span v-if="hasSubmitted && form.weight === ''" class="text-xs text-red-500 mt-1">Requis</span>
            </label>
          </div>

          <div class="flex justify-center pt-2">
            <button type="submit">Enregistrer</button>
          </div>

          <p v-if="errorMessage" class="text-xs text-red-500 text-center">Une erreur est survenue lors de l'enregistrement.</p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
