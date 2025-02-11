<template>
    <div class="surveys-container">
      <div class="header-actions">
        <h2>Suas Pesquisas</h2>
        <router-link to="/dashboard/create-survey" class="new-survey-button">
          Nova Pesquisa
        </router-link>
      </div>

      <div v-if="loading" class="loading">Carregando...</div>

      <div v-else>
        <div v-if="surveys.length === 0" class="empty-state">
          Nenhuma pesquisa encontrada. Crie sua primeira pesquisa!
        </div>

        <div v-else class="survey-list">
          <div v-for="survey in surveys" :key="survey.id" class="survey-card">
            <div class="survey-info">
              <h3>{{ survey.title }}</h3>
              <p>{{ survey.questions.length }} perguntas</p>
              <div class="survey-meta">
                <p>Criado por: {{ survey.createdBy }}</p>
                <p>Última atualização: {{ formatDate(survey.updatedAt) }} por {{ survey.updatedBy }}</p>
              </div>
            </div>
            <div class="survey-actions">
              <router-link
                :to="`/dashboard/edit-survey/${survey.id}`"
                class="edit-button"
              >
                Editar
              </router-link>
              <button
                @click="openSendModal(survey)"
                class="send-button"
              >
                Enviar
              </button>
              <button
                @click="deleteSurvey(survey.id)"
                class="delete-button"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
      <SendSurveyModal
        v-if="showSendModal"
        :surveyId="selectedSurvey"
        @close="showSendModal = false"
      />
    </div>
</template>

  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import SendSurveyModal from '@/components/SendSurveyModal.vue'
  import { useAlert } from '@/composables/useAlert'

  const surveys = ref([])
  const loading = ref(true)

  const showSendModal = ref(false)
  const selectedSurvey = ref(null)

  const showAlert = useAlert

  const openSendModal = (survey) => {
    selectedSurvey.value = survey.id
    showSendModal.value = true
  }

  onMounted(async () => {
    try {
      const { data } = await axios.get('http://localhost:5012/surveys')
      surveys.value = data
    } catch (error) {
      console.error('Erro ao carregar pesquisas:', error)
    } finally {
      loading.value = false
    }
  })

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  const deleteSurvey = async (id) => {
    try {
      const confirmDelete = window.confirm('Tem certeza que deseja excluir esta pesquisa?');
      if (!confirmDelete) return;

      // Adiciona classe de remoção
      const surveyElement = document.querySelector(`[data-survey-id="${id}"]`);
      if (surveyElement) {
        surveyElement.classList.add('removing');
      }

      // Aguarda a animação
      await new Promise(resolve => setTimeout(resolve, 300));

      // Remove do backend
      await axios.delete(`http://localhost:5012/surveys/${id}`);

      // Remove da lista
      surveys.value = surveys.value.filter(survey => survey.id !== id);

      showAlert({
        type: 'success',
        title: 'Pesquisa Excluída',
        text: 'A pesquisa foi removida com sucesso.',
        duration: 4000
      });

    } catch (error) {
      console.error('Erro ao excluir:', error);

      showAlert({
        type: 'error',
        title: 'Erro ao Excluir',
        text: 'Não foi possível remover a pesquisa.',
        duration: 6000
      });
    }
  };
  </script>

  <style scoped>
  .surveys-container {
    padding: 2rem;
  }

  .header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .new-survey-button {
    background: #1a73e8;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    text-decoration: none;
    transition: background 0.3s;
  }

  .new-survey-button:hover {
    background: #1557b0;
  }

  .send-button {
    background: #1a73e8;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .survey-list {
    display: grid;
    gap: 1rem;
  }

  .survey-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid #dadce0;
    border-radius: 8px;
    background: white;
  }

  .survey-info h3 {
    margin-bottom: 0.5rem;
    color: #202124;
  }

  .survey-meta {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #5f6368;
  }

  .survey-actions {
    display: flex;
    gap: 1rem;
  }

  .edit-button {
    background: #34a853;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    text-decoration: none;
  }

  .delete-button {
    background: #dc3545;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .empty-state {
    padding: 2rem;
    text-align: center;
    color: #5f6368;
    border: 2px dashed #dadce0;
    border-radius: 8px;
  }
  </style>
