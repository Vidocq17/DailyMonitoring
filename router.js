import { createRouter, createWebHistory } from 'vue-router'
import History from '@/History.vue'
import Charts from '@/Views/Charts.vue'
import Add from '@/Views/Add.vue'
import Homepage from '@/Views/Homepage.vue'
import WorkoutStats from '@/Views/Charts/WorkoutCharts.vue'

const routes = [
  { path: '/', name: 'Home', component: Homepage },
  { path: '/add', component: Add },
  { path: '/history', component: History },
  { path: '/stats', component: Charts },
  { path: '/workout-stats', component: WorkoutStats },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
