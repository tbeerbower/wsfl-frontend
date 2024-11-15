import { createRouter, createWebHistory } from 'vue-router'
import RunnerList from '../views/RunnerList.vue'

const routes = [
  {
    path: '/',
    redirect: '/runners'
  },
  {
    path: '/runners',
    name: 'Runners',
    component: RunnerList
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('../views/ResultList.vue')
  },
  {
    path: '/runners/:id',
    name: 'RunnerDetail',
    component: () => import('../views/RunnerDetail.vue')
  },
  {
    path: '/races/:id',
    name: 'RaceDetail',
    component: () => import('../views/RaceDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 