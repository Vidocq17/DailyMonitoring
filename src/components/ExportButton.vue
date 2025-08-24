<script setup>
import { useDailyStore } from '../store/useDailyStore'
import Papa from 'papaparse'

const store = useDailyStore()

const exportCSV = () => {
  const csv = Papa.unparse(store.entries)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', 'daily_monitoring.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <button @click="exportCSV" class="bg-green-600 text-white px-4 py-2 rounded-lg">
    Export CSV
  </button>
</template>
