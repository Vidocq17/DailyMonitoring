<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWorkoutStore } from '@/store/useWorkoutStore'
import { useToast } from 'vue-toastification'

const store = useWorkoutStore()
const toast = useToast()

const password = import.meta.env.VITE_PASSWORD
const passwordCheck = ref('')

const form = ref({
  run_at: new Date().toISOString().slice(0, 16), // input datetime-local
  duration: '', // "hh:mm:ss" ou "mm:ss"
  distance_km: '', // optionnel
  comment: '',
})

const isPasswordInvalid = computed(
  () => passwordCheck.value !== '' && passwordCheck.value !== password,
)

function parseDurationToSeconds(input: string): number | null {
  const parts = input.trim().split(':').map((p) => p.trim())
  if (parts.length < 2 || parts.length > 3) return null

  const nums = parts.map((p) => Number(p))
  if (nums.some((n) => Number.isNaN(n) || n < 0)) return null

  let h = 0, m = 0, s = 0
  if (nums.length === 2) [m, s] = nums
  if (nums.length === 3) [h, m, s] = nums

  if (m >= 60 || s >= 60) return null
  return h * 3600 + m * 60 + s
}

const isFormValid = computed(() => {
  const sec = parseDurationToSeconds(form.value.duration)
  return (
    passwordCheck.value === password &&
    form.value.run_at !== '' &&
    sec !== null &&
    sec > 0
  )
})

const resetForm = () => {
  form.value = {
    run_at: new Date().toISOString().slice(0, 16),
    duration: '',
    distance_km: '',
    comment: '',
  }
}

const saveRun = async () => {
  if (!isFormValid.value) {
    toast.error('Remplis au minimum la date + durée et le mot de passe.')
    return
  }

  const duration_sec = parseDurationToSeconds(form.value.duration)
  if (!duration_sec) {
    toast.error('Durée invalide. Format attendu : mm:ss ou hh:mm:ss')
    return
  }

  const distance = form.value.distance_km === '' ? null : Number(form.value.distance_km)
  if (distance !== null && (Number.isNaN(distance) || distance < 0)) {
    toast.error('Distance invalide.')
    return
  }

  try {
    await store.addRun({
      run_at: new Date(form.value.run_at).toISOString(),
      duration_sec,
      distance_km: distance,
      comment: form.value.comment,
    })
    toast.success('Course enregistrée ✅')
    resetForm()
  } catch (e) {
    console.error(e)
    toast.error("Erreur lors de l'enregistrement.")
  }
}
</script>

<template>
  <div class="flex flex-col items-center my-6 px-4">
    <div class="w-full max-w-3xl space-y-6">
      <div class="text-center space-y-1">
        <h2 class="text-2xl font-semibold">Ajouter une course</h2>
        <p class="text-sm text-[var(--color-muted)]">
          Enregistre tes sorties (durée + optionnellement distance).
        </p>
      </div>

      <div class="bg-[var(--color-light)] p-6 md:p-8 rounded-2xl shadow-md border border-[var(--color-border)] space-y-6">
        <div class="flex flex-col items-center gap-2">
          <label class="w-full max-w-xs text-sm font-medium text-left">
            Mot de passe
            <input type="password" v-model="passwordCheck" placeholder="••••••••" class="w-full mt-1" />
          </label>
          <p v-if="isPasswordInvalid" class="text-xs text-red-500">Mot de passe incorrect</p>
        </div>

        <form @submit.prevent="saveRun" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex flex-col text-sm font-medium">
              Date / heure
              <input type="datetime-local" v-model="form.run_at" />
            </label>

            <label class="flex flex-col text-sm font-medium">
              Durée (mm:ss ou hh:mm:ss)
              <input type="text" v-model="form.duration" placeholder="45:30 ou 01:02:15" />
            </label>

            <label class="flex flex-col text-sm font-medium">
              Distance (km) (optionnel)
              <input type="number" v-model="form.distance_km" step="0.1" min="0" placeholder="10" />
            </label>

            <label class="flex flex-col text-sm font-medium md:col-span-2">
              Commentaire (optionnel)
              <input type="text" v-model="form.comment" placeholder="EF, fractionné, sensations..." />
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
