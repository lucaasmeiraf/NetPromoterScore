<template>
    <div class="survey-card" @click="navigateToDashboard">
      <div class="card-header">
        <h3>{{ survey.title }}</h3>
        <span class="response-count">{{ survey.responseCount }} respostas</span>
      </div>
      <div class="card-body">
        <div class="meta-info">
          <span>Criado em: {{ formattedDate }}</span>
          <span>Última resposta: {{ lastResponseDate }}</span>
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
  
  const formattedDate = computed(() => {
    return new Date(props.survey.createdAt).toLocaleDateString()
  })
  
  const lastResponseDate = computed(() => {
    return props.survey.lastResponse 
      ? new Date(props.survey.lastResponse).toLocaleDateString()
      : 'Nenhuma resposta'
  })
  
  const navigateToDashboard = () => {
    router.push(`/dashboard/responses/${props.survey.id}`)
  }
  </script>
  
  <style scoped>
  .survey-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid #e2e8f0;
  }
  
  .survey-card:hover {
    transform: translateY(-2px);
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
  }
  
  .response-count {
    background: #e2e8f0;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  .meta-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: #64748b;
    font-size: 0.9rem;
  }
  </style>