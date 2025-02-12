<template>
  <div class="public-container">
    <div v-if="survey && !submitted" class="survey-card">
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
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import useAlert from '@/composables/useAlert'

// Componentes dinâmicos
import RangeQuestion from '@/components/questions/RangeQuestion.vue'
import RadioQuestion from '@/components/questions/RadioQuestion.vue'
import CheckboxQuestion from '@/components/questions/CheckboxQuestion.vue'
import TextQuestion from '@/components/questions/TextQuestion.vue'

const route = useRoute()
const router = useRouter()
const survey = ref(null)
const answers = ref([])
const submitted = ref(false)
const submitStatus = ref(null);
const submitMessage = ref('');
const sendId = ref(route.query.sendId);
const loading = ref(false);

const { showAlert } = useAlert();

const getQuestionComponent = (type) => {
  return {
    range: RangeQuestion,
    radio: RadioQuestion,
    checkbox: CheckboxQuestion,
    text: TextQuestion
  }[type]
}

onMounted(async () => {
  try {
    //const storageKey = `survey_${route.params.id}_submitted`

    // Verificação no localStorage
    if (localStorage.getItem(`sendId_${sendId.value}`)) {
      await router.replace({ name: 'SurveyAlreadySubmitted' })
      return
    }

    // 2. Gerenciar ID único do cliente
    let clientId = localStorage.getItem('clientId')
    if (!clientId) {
      clientId = crypto.randomUUID()
      localStorage.setItem('clientId', clientId)
    }

    // 3. Verificação no backend
    const response = await axios.get(`/surveys/check-submission/${sendId.value}`)
    if (response.data.submitted) {
      localStorage.setItem(`sendId_${sendId.value}`, 'true')
      await router.replace({ name: 'SurveyAlreadySubmitted' })
    }

    // 4. Carregar pesquisa se todas as verificações passarem
    const { data } = await axios.get(`http://localhost:5012/surveys/${route.params.id}`)
    survey.value = data

    // Inicializar respostas (mantido igual)
    survey.value.questions.forEach((q, index) => {
      answers.value[index] = q.type === 'checkbox' ? [] : '';
    });

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
        clientId: localStorage.getItem('clientId'),
        questions: survey.value.questions.map(q => ({
          id: q.id,
          text: q.text,
          type: q.type
        })),
        respondedAt: new Date().toISOString()
      })

      // Marcar como enviado localmente
      localStorage.setItem(`survey_${route.params.id}_submitted`, 'true')


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
/* Reset básico */
.public-container * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container principal */
.public-container {
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
}

/* Card da pesquisa */
.survey-card {
  width: 100%;
  max-width: 499px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin: 1rem 0;
}

/* Formulário */
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Questões */
.question {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.question label {
  font-weight: 500;
  color: #1e293b;
  font-size: 1.1rem;
}

/* Textarea ajustado */
.text-question textarea {
  width: 100%;
  max-width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.text-question textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Confirmação */
.confirmation-card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 90%;
  width: 500px;
  z-index: 1000;
}

/* Botão de envio */
button[type="submit"] {
  background: #1a73e8;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background 0.3s ease;
  align-self: center;
  width: auto;
  margin-top: 1rem;
}

button[type="submit"]:hover {
  background: #1557b0;
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: grid;
  place-items: center;
  z-index: 999;
  backdrop-filter: blur(2px);
}

.survey-card {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 4px;
  }

/* Ajustes responsivos */
@media (max-width: 768px) {
  .public-container {
    padding: 1rem;
  }

  .survey-card {
    padding: 1.5rem;
  }

  .confirmation-card {
    padding: 1.5rem;
    width: 90%;
  }

  button[type="submit"] {
    width: 100%;
  }
}
</style>
