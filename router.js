import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/App.vue'
import History from '@/History.vue'
import Stats from '@/Stats.vue'
import DailyForm from '@/components/DailyForm.vue'
import Accueil from '@/components/Accueil.vue'
import Sport from '@/components/Sport.vue'
import WorkoutStats from '@/components/WorkoutCharts.vue'

const routes = [
  { path: '/', name: 'Home', component: Accueil },
  { path: '/add', component: DailyForm },
  { path: '/history', component: History },
  { path: '/stats', component: Stats },
  { path: '/sport', component: Sport },
  { path: '/workout-stats', component: WorkoutStats },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
