import { createRouter, createWebHistory } from 'vue-router'
import History from '@/History.vue'
import Stats from '@/components/Stats.vue'
import Add from '@/components/Add.vue'
import Homepage from '@/components/Homepage.vue'
import WorkoutStats from '@/components/Charts/WorkoutCharts.vue'

const routes = [
  { path: '/', name: 'Home', component: Homepage },
  { path: '/add', component: Add },
  { path: '/history', component: History },
  { path: '/stats', component: Stats },
  { path: '/workout-stats', component: WorkoutStats },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
