<template>
  <div class="survey-card" @click="navigateToDashboard">
    <div class="card-header">
      <h3>{{ survey.title }}</h3>
      <div class="nps-badge" :class="npsClass">
        {{ survey.npsScore }}
      </div>
    </div>

    <div class="card-stats">
      <div class="stat">
        <span class="stat-value">{{ survey.responseCount }}</span>
        <span class="stat-label">Respostas</span>
      </div>

      <div class="stat">
        <span class="stat-value">{{ lastResponse }}</span>
        <span class="stat-label">Última resposta</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  survey: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const lastResponse = computed(() => {
  return props.survey.lastResponse
    ? props.survey.lastResponse.toLocaleDateString('pt-BR')
    : 'N/A'
})

const npsClass = computed(() => {
  if (props.survey.npsScore >= 50) return 'nps-positive'
  if (props.survey.npsScore <= -10) return 'nps-negative'
  return 'nps-neutral'
})

const navigateToDashboard = () => {
  router.push({ name: 'Dashboard da Pesquisa', params: { surveyId: props.survey.id } })
}
</script>

<style scoped>
.survey-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e2e8f0;
}

.survey-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.1rem;
  color: #1a365d;
  margin: 0;
}

.nps-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.nps-positive {
  background: #10b98120;
  color: #10b981;
}

.nps-neutral {
  background: #f59e0b20;
  color: #f59e0b;
}

.nps-negative {
  background: #ef444420;
  color: #ef4444;
}

.card-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat {
  text-align: center;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e40af;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
}
</style>
