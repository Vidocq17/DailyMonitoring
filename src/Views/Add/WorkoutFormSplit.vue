<script setup>
import { ref, computed, watch } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore'
import { useToast } from 'vue-toastification'

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

const groupes_muscu = ['PECS', 'DOS', 'EPAULES', 'QUADRICEPS', 'BICEPS', 'TRICEPS', 'ISCHIOS/FESSIERS']

const exercisesBySession = {
  PECS: [
    'Développé couché barre',
    'Développé incliné haltères',
    'Écarté à la poulie',
    'Pec deck',
  ],
  DOS: [
    'Tractions assistées / Tirage vertical',
    'Rowing barre',
    'Rowing unilateral haltères',
    'Tirage poulie basse',
    'Pullover câble',
    'Reverse cable crossover',
  ],
  EPAULES: [
    'Développé militaire barre',
    'Élévations latérales haltères',
    'Oiseau haltères / câble',
    'Shrug haltères',
    'Farmer Walk',
  ],
  QUADRICEPS: [
    'Squat barre guidée',
    'Presse inclinée',
    'Fentes marchées',
    'Bulgarian split squat',
    'Leg extension',
    'Mollets',
  ],
  BICEPS: [
    'Curl incliné haltères',
    'Curl marteau haltères',
    'Curl barre EZ',
    'Avant-bras / Grip',
  ],
  TRICEPS: [
    'Skullcrusher barre EZ',
    'Pushdown câble',
    'extension overhead',
    'Dips',
  ],
  'ISCHIOS/FESSIERS': [
    'Soulevé de terre roumain',
    'Hip thrust',
    'Leg curl',
    'Abducteurs machine',
  ],
}

const filteredExercises = computed(() => {
  if (!form.value.session) return []
  return exercisesBySession[form.value.session] ?? []
})

watch(
  () => form.value.session,
  () => {
    form.value.exercise_name = ''
  },
)

const labelToKey = [
  { label: 'Développé couché barre', key: 'developpe_couche_barre' },
  { label: 'Développé incliné haltères', key: 'developpe_incline_halteres' },
  { label: 'Écarté à la poulie', key: 'ecarte_poulie' },
  { label: 'Pec deck', key: 'chest_press_machine' },

  { label: 'Tractions assistées / Tirage vertical', key: 'tractions_assistees' },
  { label: 'Rowing barre', key: 'rowing_barre' },
  { label: 'Rowing unilateral haltères', key: 'rowing_unilateral_halteres' },
  { label: 'Tirage poulie basse', key: 'tirage_poulie_basse' },
  { label: 'Pullover câble', key: 'pullover_cable' },
  { label: 'Reverse cable crossover', key: 'reverse_cable' },

  { label: 'Développé militaire barre', key: 'developpe_militaire_barre' },
  { label: 'Élévations latérales haltères', key: 'elevations_laterales_halteres' },
  { label: 'Oiseau haltères / câble', key: 'oiseau_halteres_cable' },
  { label: 'Shrug haltères', key: 'shrug_halteres' },
  { label: 'Farmer Walk', key: 'farmer_walk' },

  { label: 'Squat barre guidée', key: 'squat_barre' },
  { label: 'Presse inclinée', key: 'presse_incline' },
  { label: 'Fentes marchées', key: 'fentes_marchees' },
  { label: 'Bulgarian split squat', key: 'bulgarian_split_squat' },
  { label: 'Leg extension', key: 'leg_extension' },
  { label: 'Mollets', key: 'mollets' },

  { label: 'Curl incliné haltères', key: 'curl_halteres' },
  { label: 'Curl marteau haltères', key: 'curl_marteau_halteres' },
  { label: 'Curl barre EZ', key: 'curl_barre' },
  { label: 'Avant-bras / Grip', key: 'grip_halteres' },
  
  { label: 'Skullcrusher barre EZ', key: 'skullcrusher' },
  { label: 'Pushdown câble', key: 'pushdown_cable' },
  { label: 'extension overhead', key: 'extension_overhead' },
  { label: 'Dips', key: 'dips' },

  { label: 'Soulevé de terre roumain', key: 'souleve_de_terre' },
  { label: 'Hip thrust', key: 'hip_thrust' },
  { label: 'Leg curl', key: 'leg_curl' },
  { label: 'Abducteurs machine', key: 'leg_abduction' },
]

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
  form.value = {
    session: '',
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
    console.log('Saved weight:', form.value.weight, 'for exercise:', exercise.key)
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

      <div
        class="bg-[var(--color-light)] p-6 md:p-8 rounded-2xl shadow-md border border-[var(--color-border)] space-y-6">
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
                <option v-for="session in groupes_muscu" :key="session" :value="session">
                  {{ session }}
                </option>
              </select>
            </label>

            <label class="flex flex-col text-sm font-medium">
              Exercice
              <select v-model="form.exercise_name" :disabled="!form.session">
                <option value="" disabled>
                  {{ form.session ? 'Sélectionner un exercice' : 'Choisir une séance d’abord' }}
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
