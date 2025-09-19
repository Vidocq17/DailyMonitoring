<script setup>
import { ref, onMounted } from 'vue'
import { useDailyStore } from './store/useDailyStore'
import { useToast } from 'vue-toastification'

const store = useDailyStore()
const editingId = ref(null)
const editedEntry = ref({})
const toast = useToast()

onMounted(() => {
  store.fetchDaily()
})

const startEdit = (entry) => {
  editingId.value = entry.id
  editedEntry.value = { ...entry }
}

const cancelEdit = () => {
  editingId.value = null
  editedEntry.value = {}
}

const saveEdit = async () => {
  await store.updateDaily(editingId.value, editedEntry.value)
  editingId.value = null
  toast.success('Entrée mise à jour ✅')
}

const deleteDaily = async (id) => {
  if (confirm('Es-tu sûr de vouloir supprimer cette entrée ?')) {
    await store.deleteDaily(id)
    toast.success('Entrée supprimée ✅')
  }
}

const date = new Date()
const formattedDate = date.toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})
</script>

<template>
  <div class="bg-[var(--color-surface)] p-5 rounded-2xl" style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)">
    <div class="flex justify-center items-center mb-4 w-full">
      <p>Date actuelle : {{ formattedDate }}</p>
    </div>

    <div class="overflow-x-auto">
      <table class="daily-table w-full border-collapse min-w-[800px]">
        <thead>
          <tr>
            <th>Date</th>
            <th>Kcal</th>
            <th>Glucides</th>
            <th>Lipides</th>
            <th>Protéines</th>
            <th>Pas</th>
            <th>Eau (L)</th>
            <th>Poids</th>
            <th>Sport</th>
            <th style="width: 150px">Séance</th>
            <th>Cardio</th>
            <th>Km</th>
            <th>Type de cardio</th>
            <th>Abdos</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in store.entries" :key="entry.id">
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.date_du_jour" type="date" />
              <span v-else>{{ new Date(entry.date_du_jour).toLocaleDateString() }}</span>
            </td>
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.kcal" type="number" />
              <span v-else>{{ entry.kcal }}</span>
            </td>
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.glucides" type="number" />
              <span v-else>{{ entry.glucides }}</span>
            </td>
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.lipides" type="number" />
              <span v-else>{{ entry.lipides }}</span>
            </td>
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.proteines" type="number" />
              <span v-else>{{ entry.proteines }}</span>
            </td>
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.pas" type="number" />
              <span v-else>{{ entry.pas }}</span>
            </td>
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.eau" type="number" step="0.1" />
              <span v-else>{{ entry.eau }}</span>
            </td>
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.poids" type="number" step="0.01" />
              <span v-else>{{ entry.poids }}</span>
            </td>
            <td>
              <input v-if="editingId === entry.id" type="checkbox" v-model="editedEntry.sport" />
              <span v-else :class="entry.sport ? 'badge badge-green' : 'badge badge-red'">
                {{ entry.sport ? 'Oui' : 'Non' }}
              </span>
            </td>
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.seance" />
              <span v-else>{{ entry.seance || '-' }}</span>
            </td>
            <td>
              <input v-if="editingId === entry.id" type="checkbox" v-model="editedEntry.cardio" />
              <span v-else :class="entry.cardio ? 'badge badge-green' : 'badge badge-red'">
                {{ entry.cardio ? 'Oui' : 'Non' }}
              </span>
            </td>
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.km" />
              <span v-else>{{ entry.km || '-' }}</span>
            </td>
            <td>
              <input v-if="editingId === entry.id" v-model="editedEntry.typeof_cardio" />
              <span v-else>{{ entry.typeof_cardio || '-' }}</span>
            </td>
            <td>
              <input v-if="editingId === entry.id" type="checkbox" v-model="editedEntry.abdos" />
              <span v-else :class="entry.abdos ? 'badge badge-green' : 'badge badge-red'">
                {{ entry.abdos ? 'Oui' : 'Non' }}
              </span>
            </td>
            <td>
              <div class="button-group" v-if="editingId === entry.id">
                <button class="btn btn-save" @click="saveEdit">💾 Sauvegarder</button>
                <button class="btn btn-cancel" @click="cancelEdit">❌ Annuler</button>
              </div>
              <div v-else>
                <button class="btn btn-edit" @click="startEdit(entry)">✏️ Modifier</button>
                <button class="btn btn-cancel" @click="deleteDaily(entry.id)">🗑️ Supprimer</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
