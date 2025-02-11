<template>
  <div class="public-container">
    <div v-if="!submitted" class="survey-card">
      <h1>{{ survey.title }}</h1>

      <form @submit.prevent="handleSubmit">
        <div
          v-for="(question, index) in survey.questions"
          :key="index"
          class="question"
        >
          <label>{{ question.text }}</label>

          <!-- Renderização dinâmica das questões -->
          <component
            :is="getQuestionComponent(question.type)"
            :question="question"
            v-model="answers[index]"
          />
        </div>

        <button type="submit">Enviar Respostas</button>
      </form>
    </div>

    <div v-else class="confirmation-card">
      <h2>✅ Obrigado por responder!</h2>
      <p>Sua avaliação foi registrada com sucesso.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// Componentes dinâmicos
import RangeQuestion from '@/components/questions/RangeQuestion.vue'
import RadioQuestion from '@/components/questions/RadioQuestion.vue'
import CheckboxQuestion from '@/components/questions/CheckboxQuestion.vue'

const route = useRoute()
const survey = ref({})
const answers = ref([])
const submitted = ref(false)

const getQuestionComponent = (type) => {
  return {
    range: RangeQuestion,
    radio: RadioQuestion,
    checkbox: CheckboxQuestion
  }[type]
}

  onMounted(async () => {
    try {
      const { data } = await axios.get(`http://localhost:5012/surveys/${route.params.id}`)
      survey.value = data
      answers.value = new Array(data.questions.length).fill('')
    } catch (error) {
      console.error('Erro ao carregar pesquisa:', error)
    }
  })

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5012/responses', {
        surveyId: survey.value.id,
        answers: answers.value,
        respondedAt: new Date().toISOString()
      })

      alert('Obrigado por responder a pesquisa!')
    } catch (error) {
      console.error('Erro ao enviar respostas:', error)
    }
  }
  </script>

  <style scoped>
  .public-survey-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
  }

  .public-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
  }

  .survey-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .survey-card, .confirmation-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .confirmation-card {
    text-align: center;
    padding: 3rem;
  }

  .question {
    margin-bottom: 2rem;
  }

  .range-input {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .radio-options,
  .checkbox-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  button[type="submit"] {
    background: #1a73e8;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    margin-top: 1.5rem;
  }
  </style>
