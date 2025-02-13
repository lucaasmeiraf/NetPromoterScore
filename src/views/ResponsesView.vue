<template>
  <div class="responses-view">
    <h2 class="page-title">Relatórios de Pesquisas</h2>
    <div v-if="loading" class="loading">Carregando pesquisas...</div>
    <div v-else-if="error" class="error">Erro ao carregar pesquisas</div>
    <div v-else class="survey-grid">
      <SurveyCard
        v-for="survey in surveys"
        :key="survey.id"
        :survey="survey"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import SurveyCard from '@/components/SurveyCard.vue'

const route = useRoute()

const surveys = ref([])
const loading = ref(true)
const error = ref(false)

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/dashboard/responses') {
      onMounted() // Recarrega os dados ao voltar
    }
  }
)

onMounted(async () => {
  try {
    loading.value = true
    const { data } = await axios.get('http://localhost:5012/surveys?_embed=responses')

    surveys.value = data.map(survey => ({
      id: survey.id,
      title: survey.title,
      responseCount: survey.responses?.length || 0,
      lastResponse: survey.responses?.length
        ? new Date(Math.max(...survey.responses.map(r => new Date(r.respondedAt))))
        : null,
      npsScore: calculateNps(survey.responses)
    }))

  } catch (e) {
    error.value = true
    console.error('Erro ao carregar pesquisas:', e)
  } finally {
    loading.value = false
  }
})

const calculateNps = (responses = []) => {
  const scores = responses.flatMap(r =>
    r.answers.filter(a => a.type === 'nps').map(a => parseInt(a.value)))
  const promoters = scores.filter(s => s >= 9).length
  const detractors = scores.filter(s => s <= 6).length
  return promoters - detractors
}
</script>

<style scoped>
.responses-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #1a365d;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.survey-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.error {
  color: #ef4444;
}
</style>
