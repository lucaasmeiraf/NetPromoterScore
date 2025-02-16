<template>
    <div class="survey-dashboard">
      <div class="dashboard-container">
        <div class="header">
          <div class="header-top">
            <div class="title-wrapper">
              <h1>{{ survey.title }}</h1>
                  <!-- Filtros -->
                  <div class="filters">
                    <div class="filter-group">
                      <label>Data inicial:</label>
                      <input
                        type="date"
                        v-model="startDate"
                        :max="endDate || ''"
                      />
                    </div>

                    <div class="filter-group">
                      <label>Data final:</label>
                      <input
                        type="date"
                        v-model="endDate"
                        :min="startDate || ''"
                        @change="validateDates"
                      />
                    </div>

                    <div class="filter-group">
                      <label>Usuário:</label>
                      <select v-model="selectedUser">
                        <option value="">Todos</option>
                        <option
                          v-for="user in users"
                          :key="user.id"
                          :value="user.id"
                        >
                          {{ user.name }}
                        </option>
                      </select>
                    </div>
                  </div>
          </div>
            <div class="stats">
              <div class="stat-item">
                <span class="stat-value">{{ responseCount }}</span>
                <span class="stat-label">Respostas</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ npsScore }}</span>
                <span class="stat-label">NPS Score</span>
              </div>
            </div>
          </div>


        </div>

        <!-- Grid de gráficos responsivo -->
        <div class="chart-grid">
            <NpsDistributionChart
              :surveyId="surveyId"
              :startDate="startDate"
              :endDate="endDate"
              :userId="selectedUser"
            />
            <ResponseTrendChart
              :surveyId="surveyId"
              :startDate="startDate"
              :endDate="endDate"
              :userId="selectedUser"
            />
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  import NpsDistributionChart from '@/components/charts/NpsDistributionChart.vue'
  import ResponseTrendChart from '@/components/charts/ResponseTrendChart.vue'

  const route = useRoute()
  const surveyId = route.params.surveyId
  const survey = ref({
    title: '',
    responses: []
  })

  const startDate = ref('')
  const endDate = ref('')
  const selectedUser = ref('')
  const users = ref([])

  const state = ref({
    survey: {
      title: '',
      responses: []
    },
    filters: {
      startDate: '',
      endDate: '',
      userId: ''
    },
    users: [],
    loading: false
  })

  const fetchSurveyData = async () => {
    try {
      state.value.loading = true

      const params = {
        _embed: 'responses',
        _expand: 'user'
      }

      if(state.value.filters.startDate) {
        params.respondedAt_gte = `${state.value.filters.startDate}T00:00:00.000Z`
      }

      if(state.value.filters.endDate) {
        params.respondedAt_lte = `${state.value.filters.endDate}T23:59:59.999Z`
      }

      const { data } = await axios.get(`http://localhost:5012/surveys/${surveyId}`, {
        params
      })

      state.value.survey = data
      state.value.loading = false

    } catch (error) {
      console.error('Erro ao carregar pesquisa:', error)
      state.value.loading = false
    }
  }


  const validateDates = () => {
    if(startDate.value && endDate.value) {
      const start = new Date(startDate.value)
      const end = new Date(endDate.value)
      if(start > end) {
        alert('A data final deve ser posterior à data inicial')
        endDate.value = ''
      }
    }
  }

  // Calcular dados das respostas
  const responseData = computed(() => {
    return survey.value.responses?.flatMap(response =>
      response.answers.filter(answer => answer.type === 'nps')
  )})

  const responseCount = computed(() => survey.value.responses?.length || 0)

  const npsScore = computed(() => {
    if (!responseData.value?.length) return 0

    const scores = responseData.value.map(answer => parseInt(answer.value))
    const promoters = scores.filter(score => score >= 9).length
    const detractors = scores.filter(score => score <= 6).length
    const total = scores.length

    return Math.round(((promoters - detractors) / total) * 100)
  })

  watch(() => state.value.filters, (newFilters) => {
  if(newFilters.startDate && newFilters.endDate) {
    const start = new Date(newFilters.startDate)
    const end = new Date(newFilters.endDate)
    if(start > end) return
  }
  fetchSurveyData()
}, { deep: true })

onMounted(async () => {
  await fetchSurveyData()
  // Busca usuários
  try {
    const { data } = await axios.get('http://localhost:5012/users')
    state.value.users = data
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  }
})

  onMounted(async () => {
    try {
      const { data } = await axios.get(`http://localhost:5012/surveys/${surveyId}?_embed=responses`)
      survey.value = data
    } catch (error) {
      console.error('Erro ao carregar pesquisa:', error)
    }
  })

  </script>

  <style scoped>
  .survey-dashboard {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .stats {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .stat-item {
    text-align: center;
    padding: 1rem 1.5rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    min-width: 120px;
    transition: transform 0.2s ease;
  }

  .stat-item:hover {
    transform: translateY(-2px);
  }

  .stat-value {
    display: block;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.85rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }

  .filters {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    flex-wrap: wrap;
    background: #f8fafc;
    padding: 1rem;
    border-radius: 12px;
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .filter-group label {
    font-size: 0.9rem;
    color: #475569;
    font-weight: 500;
  }

  input[type="date"],
  select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    font-size: 0.9rem;
    color: #1e293b;
    min-width: 180px;
  }

  .chart-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
  }

  .chart-container {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .survey-dashboard {
      padding: 1rem;
    }

    .header-top {
      flex-direction: column;
    }

    .stats {
      width: 100%;
      justify-content: center;
    }

    .filters {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-group {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.9rem;
      margin-top: 0.5rem;
      display: none; /* Será mostrado via JavaScript se necessário */
    }

    input:invalid {
      border-color: #ef4444;
    }

    input:invalid + .error-message {
      display: block;
    }

    input[type="date"],
    select {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .stat-item {
      flex: 1 1 100%;
    }

    .chart-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
