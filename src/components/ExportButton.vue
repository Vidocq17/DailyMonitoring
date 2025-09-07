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
  <button @click="exportCSV">Export CSV</button>
</template>

<style scoped>
button {
  background: linear-gradient(to right, #3b82f6, #2563eb);
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s;
  width: 30%;
}

button:hover {
  background: linear-gradient(to right, #2563eb, #1e40af);
}
</style>
