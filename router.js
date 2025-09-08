import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/App.vue'
import History from '@/History.vue'
import Stats from '@/Stats.vue'
import DailyForm from '@/components/Add/DailyForm.vue'
import Homepage from '@/components/Homepage.vue'
import Sport from '@/components/Add/SportForm.vue'
import WorkoutStats from '@/components/Charts/WorkoutCharts.vue'

const routes = [
  { path: '/', name: 'Home', component: Homepage },
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
