<template>
    <div class="survey-dashboard">
      <div class="header">
        <h1>{{ survey.title }}</h1>
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

      <div class="chart-grid">
        <NpsDistributionChart :surveyId="surveyId" />
        <ResponseTrendChart :surveyId="surveyId" />
        <!-- <QuestionBreakdownChart :surveyId="surveyId" /> -->
      </div>
    </div>
  </template>

  <script setup>
  import { ref, computed, onMounted } from 'vue'
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

  // Calcular dados das respostas
  const responseData = computed(() => {
    return survey.value.responses?.flatMap(response =>
      response.answers.filter(answer => answer.type === 'nps')
  )})

  const responseCount = computed(() => survey.value.responses?.length || 0)

  const npsScore = computed(() => {
    if (!responseData.value) return 0

    const scores = responseData.value.map(answer => parseInt(answer.value))
    const promoters = scores.filter(score => score >= 9).length
    const detractors = scores.filter(score => score <= 6).length

    return promoters - detractors
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
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .stats {
    display: flex;
    gap: 2rem;
  }

  .stat-item {
    text-align: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    min-width: 100px;
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e40af;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #64748b;
  }

  .chart-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
  </style>
