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

    <transition name="fade">
      <div v-if="submitted" class="confirmation-card">
        <div class="card-content">
          <svg v-if="submitStatus === 'success'" class="icon success" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          
          <svg v-if="submitStatus === 'error'" class="icon error" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>

          <h3>{{ submitStatus === 'success' ? 'Resposta Enviada!' : 'Erro no Envio' }}</h3>
          <p>{{ submitMessage }}</p>

          <button 
            v-if="submitStatus === 'error'"
            @click="submitted = false"
            class="retry-btn"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    </transition>

    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import useAlert from '@/composables/useAlert'

// Componentes dinâmicos
import RangeQuestion from '@/components/questions/RangeQuestion.vue'
import RadioQuestion from '@/components/questions/RadioQuestion.vue'
import CheckboxQuestion from '@/components/questions/CheckboxQuestion.vue'

const route = useRoute()
const survey = ref(null)
const answers = ref([])
const submitted = ref(false)
const submitStatus = ref(null);
const submitMessage = ref('');
const loading = ref(false);

const { showAlert } = useAlert();

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

      survey.value.questions.forEach((q, index) => {
        answers.value[index] = q.type === 'checkbox' ? [] : '';
      });
      //answers.value = new Array(data.questions.length).fill('')
    } catch (error) {
      showAlert({
          type: 'error',
          title: 'Erro ao mostrar Pesquisa',
          text: 'Erro ao mostrar pesquisa, recarregue a página',
          duration: 4000
        });
      console.error('Erro ao carregar pesquisa:', error)
    }
  })

  const handleSubmit = async () => {
    loading.value = true;
    try {
      await axios.post('http://localhost:5012/responses', {
        surveyId: survey.value.id,
        answers: answers.value,
        questions: survey.value.questions.map(q => ({ // Adicione tipos das perguntas
          id: q.id,
          text: q.text,
          type: q.type 
        })),
        respondedAt: new Date().toISOString()
      })

       submitStatus.value = 'success';
       submitMessage.value = 'Obrigado por participar da nossa pesquisa!';
    } catch (error) {
      submitStatus.value = 'error';
      submitMessage.value = 'Erro ao enviar respostas. Por favor, tente novamente.';
      console.error('Erro ao enviar respostas:', error)
    } finally{
      loading.value = false;
      submitted.value = true;
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
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    text-align: center;
    z-index: 1000;
  }

  .icon {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
  }

  .success {
    color: #34A853;
  }

  .error {
    color: #EA4335;
  }

  .retry-btn {
    margin-top: 1rem;
    padding: 8px 16px;
    background: #1a73e8;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
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

  /* Animação de Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.8);
  display: grid;
  place-items: center;
  z-index: 999;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1a73e8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Transição */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
  </style>
