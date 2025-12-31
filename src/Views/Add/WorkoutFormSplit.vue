<script setup>
import { ref, computed, watch } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore'
import { useToast } from 'vue-toastification'

const store = useWorkoutStore()
const toast = useToast()

const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref('')

const form = ref({
  session: '',
  exercise_name: '',
  weight: '',
})

const seances = ['PECS', 'DOS', 'EPAULES', 'QUADRICEPS', 'BRAS', 'ISCHIOS/FESSIERS']

/**
 * ✅ Exos par séance (nouveau programme)
 * Tu peux réordonner comme tu veux, l’UI suivra.
 */
const exercisesBySession = {
  PECS: [
    'Développé couché barre',
    'Développé incliné haltères',
    'Dips',
    'Écarté à la poulie',
    'Pushdown câble',
    'Pec deck',
  ],
  DOS: [
    'Tractions assistées / Tirage vertical',
    'Rowing barre',
    'Tirage poulie basse',
    'Pullover câble',
    'Reverse cable crossover',
  ],
  EPAULES: [
    'Développé militaire barre',
    'Élévations latérales haltères',
    'Oiseau haltères / câble',
    'Shrug haltères',
  ],
  QUADRICEPS: [
    'Squat barre guidée / Presse',
    'Fentes marchées',
    'Leg extension',
    'Mollets debout / presse',
  ],
  BRAS: [
    'Curl barre EZ',
    'Curl incliné haltères',
    'Skullcrusher barre EZ',
    'Pushdown câble',
    'Avant-bras / Grip',
  ],
  'ISCHIOS/FESSIERS': [
    'Soulevé de terre roumain',
    'Hip thrust',
    'Leg curl',
    'Abducteurs machine',
    'Mollets assis',
  ],
}

const filteredExercises = computed(() => {
  if (!form.value.session) return []
  return exercisesBySession[form.value.session] ?? []
})

// Quand on change de séance => on reset l’exercice sélectionné
watch(
  () => form.value.session,
  () => {
    form.value.exercise_name = ''
  },
)

const labelToKey = [
  // PECS
  { label: 'Développé couché barre', key: 'developpe_couche_barre' },
  { label: 'Développé incliné haltères', key: 'developpe_incline_halteres' },
  { label: 'Dips', key: 'dips' },
  { label: 'Écarté à la poulie', key: 'ecarte_poulie' },
  { label: 'Pushdown câble', key: 'pushdown_cable' },
  { label: 'Pec deck', key: 'chest_press_machine' },

  // DOS
  { label: 'Tractions assistées / Tirage vertical', key: 'tractions_assistees' },
  { label: 'Rowing barre', key: 'rowing_barre' },
  { label: 'Tirage poulie basse', key: 'tirage_poulie_basse' },
  { label: 'Pullover câble', key: 'pullover_cable' },
  { label: 'Reverse cable crossover', key: 'reverse_cable' },

  // EPAULES
  { label: 'Développé militaire barre', key: 'developpe_militaire_barre' },
  { label: 'Élévations latérales haltères', key: 'elevations_laterales_halteres' },
  { label: 'Oiseau haltères / câble', key: 'oiseau_halteres_cable' },
  { label: 'Shrug haltères', key: 'shrug_halteres' },

  // QUADRICEPS
  { label: 'Squat barre guidée', key: 'squat_barre' },
  { label: 'Fentes marchées', key: 'fentes_marchees' },
  { label: 'Leg extension', key: 'leg_extension' },
  { label: 'Mollets debout / presse', key: 'mollets_debout_presse' },

  // BRAS
  { label: 'Curl barre EZ', key: 'curl_barre' },
  { label: 'Curl incliné haltères', key: 'curl_halteres' },
  { label: 'Skullcrusher barre EZ', key: 'skullcrusher' },
  { label: 'Avant-bras / Grip', key: 'grip_halteres' },

  // ISCHIOS/FESSIERS
  { label: 'Soulevé de terre roumain', key: 'souleve_de_terre' },
  { label: 'Hip thrust', key: 'hip_thrust' },
  { label: 'Leg curl', key: 'leg_curl' },
  { label: 'Abducteurs machine', key: 'leg_abduction' },
  { label: 'Mollets assis', key: 'mollets_assis' },
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
      <div class="text-center space-y-1">
        <h2 class="text-2xl font-semibold">Enregistrer vos poids</h2>
        <p class="text-sm text-[var(--color-muted)]">
          Choisissez une séance puis un exercice (liste filtrée).
        </p>
      </div>

      <div class="bg-[var(--color-light)] p-6 md:p-8 rounded-2xl shadow-md border border-[var(--color-border)] space-y-6">
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

        <form @submit.prevent="saveWeight" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex flex-col text-sm font-medium">
              Séance
              <select v-model="form.session">
                <option value="" disabled>Sélectionner une séance</option>
                <option v-for="session in seances" :key="session" :value="session">
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
        </form>
      </div>
    </div>
  </div>
</template>
