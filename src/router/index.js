import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  // Rota pública separada
  {
    path: '/survey/:id',
    name: 'Pesquisa Pública',
    component: () => import('../views/SurveyPublicView.vue'),
    meta: { publicPage: true }
  },
  {
    path: '/survey/already-submitted',
    name: 'SurveyAlreadySubmitted',
    component: () => import('../views/SurveyAlreadySubmitted.vue')
  },
  // Rotas do dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('../views/DashboardHome.vue')
      },
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
        path: 'responses/:surveyId',
        name: 'SurveyDashboard',
        component: () => import('../views/SurveyDashboardView.vue'),
        props: (route) => ({ surveyId: route.params.surveyId }),
        meta: { requiresAuth: true }
      },
      {
        path: 'responses',
        name: 'Respostas',
        component: () => import('../views/ResponsesView.vue')
      },
      {
        path: 'edit-survey/:id',
        name: 'Editar Pesquisa',
        component: () => import('../views/EditSurveyView.vue')
      }
    ]
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')

  // Verificar rotas que requerem autenticação
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  }
  // Verificar se já enviou a pesquisa
  else if (to.name === 'SurveyAlreadySubmitted' && !localStorage.getItem(`survey_${to.params.id}_submitted`)) {
    next('/')
  }
  else {
    next()
  }
})

export default router
