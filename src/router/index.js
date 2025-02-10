import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'create-survey',
          name: 'Criar Pesquisa',
          component: () => import('../views/CreateSurveyView.vue')
        },
        {
          path: 'surveys',
          name: 'Pesquisas',
          component: () => import('../views/SurveysView.vue')
        },
        {
          path: '/survey/:id',
          name: 'Pesquisa Pública',
          component: () => import('../views/SurveyPublicView.vue')
        },
        {
          path: 'responses',
          name: 'Respostas',
          component: () => import('../views/ResponsesView.vue')
        },
        {
          path: 'edit-survey/:id',
          name: 'Editar Pesquisa',
          component: () => import('../views/EditSurveyView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if(to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router