<template>
  <div class="responses-view">
    <div class="survey-grid">
      <SurveyCard 
        v-for="survey in surveys"
        :key="survey.id"
        :survey="survey"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import SurveyCard from '@/components/SurveyCard.vue'

const surveys = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:5012/surveys?_embed=responses')
    
    surveys.value = data.map(survey => ({
      ...survey,
      responseCount: survey.responses?.length || 0,
      lastResponse: survey.responses?.length 
        ? Math.max(...survey.responses.map(r => new Date(r.respondedAt)))
        : null
    }))
  } catch (error) {
    console.error('Erro ao carregar pesquisas:', error)
  }
})
</script>

<style scoped>
.responses-view {
  padding: 2rem;
}

.survey-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style>