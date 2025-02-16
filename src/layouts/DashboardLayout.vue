<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <nav>
        <router-link to="/dashboard">🏠 Início</router-link>
        <router-link to="/dashboard/create-survey">📝 Criar Pesquisa</router-link>
        <router-link to="/dashboard/surveys">📊 Pesquisas</router-link>
        <router-link to="/dashboard/responses">📨 Respostas</router-link>
      </nav>
    </aside>

    <main class="content">
      <header class="header">
        <div class="header-left">
          <button @click="goBack" class="back-button" v-if="showBackButton">← Voltar</button>
          <h1>{{ currentRouteName }}</h1>
        </div>
        <button @click="handleLogout" class="logout-button">Sair</button>
      </header>

      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentRouteName = computed(() => route.name)

const showBackButton = computed(() => {
  return !['Dashboard', 'Respostas', 'Pesquisas', 'Criar Pesquisa'].includes(route.name)
})

const goBack = () => {
  if (route.name === 'SurveyDashboard') {
    router.push({ name: 'Respostas' })
  } else {
    router.go(-1)
  }
}

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated')
  router.push('/')
}
</script>

<style scoped lang="scss">
  .dashboard-layout {
    display: flex;
    min-height: 100vh;

    .sidebar {
      width: 250px;
      background: #fff;
      border-right: 1px solid #dadce0;
      padding: 1rem;

      nav {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        a {
          padding: 10px;
          border-radius: 4px;
          color: #202124;
          text-decoration: none;
          transition: background 0.3s;

          &:hover {
            background: #f1f3f4;
          }

          &.router-link-exact-active {
            background: #e8f0fe;
            color: #1967d2;
          }
        }
      }
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .back-button {
      background: #f1f3f4;
      color: #202124;
      border: 1px solid #dadce0;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }

    .content {
      flex: 1;
      background: #f8f9fa;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: white;
        border-bottom: 1px solid #dadce0;

        h1 {
          font-size: 1.5rem;
          color: #202124;
        }

        button {
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }

    .dashboard-page {
      padding: 2rem;
    }

    .chart-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }

    @media (max-width: 768px) {
      .chart-grid {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
