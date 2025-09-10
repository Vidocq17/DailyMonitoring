<script setup>
import { ref, onMounted } from 'vue'
import { useDailyStore } from './store/useDailyStore'
import ExportButton from '@/components/ExportButton.vue'

const store = useDailyStore()
const editingId = ref(null)
const editedEntry = ref({})

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
}

const date = new Date()
const formattedDate = date.toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})
</script>

<template>
  <div class="daily-container">
    <div class="title">
      <h2 class="daily-title">Historique</h2>
      <p>Date actuelle : {{ formattedDate }}</p>
      <ExportButton style="margin-top: 0; width: 15%" />
    </div>

    <div class="table-wrapper">
      <table class="daily-table">
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
              <input
                v-if="editingId === entry.id"
                v-model="editedEntry.eau"
                type="number"
                step="0.1"
              />
              <span v-else>{{ entry.eau }}</span>
            </td>
            <td>
              <input
                v-if="editingId === entry.id"
                v-model="editedEntry.poids"
                type="number"
                step="0.01"
              />
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
              <div class="button-group" v-if="editingId === entry.id">
                <button class="btn btn-save" @click="saveEdit">💾 Sauvegarder</button>
                <button class="btn btn-cancel" @click="cancelEdit">❌ Annuler</button>
              </div>
              <button v-else class="btn btn-edit" @click="startEdit(entry)">✏️ Modifier</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
