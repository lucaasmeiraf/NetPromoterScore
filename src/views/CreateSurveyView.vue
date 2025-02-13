<template>
    <div class="create-survey-container">
      <form @submit.prevent="handleSubmit">
        <!-- Campo para o título da pesquisa -->
        <div class="form-group">
          <label>Título da Pesquisa</label>
          <input v-model="survey.title" type="text" required placeholder="Digite o título da pesquisa" />
        </div>

        <!-- Lista de perguntas -->
        <div class="questions-container">
          <div v-for="(question, index) in survey.questions" :key="index" class="question-card">
            <div class="question-header">
              <h3>Pergunta {{ index + 1 }}</h3>
              <button type="button" @click="removeQuestion(index)" class="remove-button">Remover</button>
            </div>
            <div class="form-group">
              <label>Texto da Pergunta</label>
              <input v-model="question.text" type="text" required placeholder="Digite a pergunta" />
            </div>
            <div class="form-group">
              <label>Tipo de Resposta</label>
              <select v-model="question.type" @change="resetOptions(question)">
                <option value="range">Escala (0-10)</option>
                <option value="radio">Múltipla Escolha (Radio)</option>
                <option value="checkbox">Múltipla Escolha (Checkbox)</option>
                <option value="text">Texto Livre</option>
              </select>
            </div>

            <!-- Opções para radio/checkbox -->
            <div v-if="question.type === 'radio' || question.type === 'checkbox'" class="options-container">
              <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="option-item">
                <input v-model="option.text" type="text" placeholder="Digite uma opção" required />
                <button type="button" @click="removeOption(index, optionIndex)" class="remove-button">Remover</button>
              </div>
              <button type="button" @click="addOption(index)" class="add-button">Adicionar Opção</button>
            </div>
          </div>
        </div>

        <!-- Botões de controle -->
        <div class="actions">
          <button type="button" @click="addQuestion" class="add-question-btn">Adicionar Pergunta</button>
          <button type="submit" class="submit-button">Salvar Pesquisa</button>
        </div>
      </form>

      <!-- Pré-visualização da pesquisa -->
      <div class="preview-container">
        <h2>Pré-visualização</h2>
        <div class="preview-card">
          <h3>{{ survey.title || "Título da Pesquisa" }}</h3>
          <div v-for="(question, index) in survey.questions" :key="index" class="preview-question">
            <p>{{ question.text || "Texto da pergunta" }}</p>
            <div v-if="question.type === 'range'" class="range-input">
              <RangeQuestion />
            </div>
            <div v-if="question.type === 'radio'" class="radio-options">
              <label v-for="(option, optionIndex) in question.options" :key="optionIndex">
                <input type="radio" :name="'question-' + index" :value="option.text" />
                {{ option.text || "Opção" }}
              </label>
            </div>
            <div v-if="question.type === 'checkbox'" class="checkbox-options">
              <label v-for="(option, optionIndex) in question.options" :key="optionIndex">
                <input type="checkbox" :name="'question-' + index" :value="option.text" />
                {{ option.text || "Opção" }}
              </label>
            </div>
            <div v-if="question.type === 'text'" class="text-question">
              <textarea placeholder="Digite sua resposta aqui..."></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  import useAlert from '@/composables/useAlert';
  import RangeQuestion from '@/components/questions/RangeQuestion.vue';

  // Estado da pesquisa
  const survey = ref({
    title: "",
    questions: [],
  });

  const { showAlert } = useAlert();
  const MAX_QUESTIONS = 20;

  // Adicionar nova pergunta
  const addQuestion = () => {
  if (survey.value.questions.length >= MAX_QUESTIONS) {
    showAlert({
      type: 'warning',
      title: 'Limite Atingido',
      text: `Máximo de ${MAX_QUESTIONS} perguntas por pesquisa.`,
      duration: 5000
    });
    return;
  }

    survey.value.questions.push({
      text: '',
      type: 'range',
      options: []
    });

    setTimeout(() => {
    const container = document.querySelector('.questions-container');
    container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Remover pergunta
  const removeQuestion = (index) => {
    survey.value.questions.splice(index, 1);
  };

  // Adicionar opção para radio/checkbox
  const addOption = (questionIndex) => {
    survey.value.questions[questionIndex].options.push({ text: "" });
  };

  // Remover opção
  const removeOption = (questionIndex, optionIndex) => {
    survey.value.questions[questionIndex].options.splice(optionIndex, 1);
  };

  // Resetar opções ao mudar o tipo de pergunta
  const resetOptions = (question) => {
    if (question.type === "range") {
      question.options = [];
    }
  };

  // Salvar pesquisa no JSON Server
  const handleSubmit = async () => {
    try {
    const user = JSON.parse(localStorage.getItem('user'))
    const surveyWithDate = {
      ...survey.value,
      createdBy: user.email,
      createdAt: new Date().toISOString(),
      updatedBy: user.email,
      updatedAt: new Date().toISOString()
    }

    await axios.post('http://localhost:5012/surveys', surveyWithDate)
    showAlert({
      type: 'success',
      title: 'Pesquisa salva',
      text: `Pesquisa salva com sucesso!`,
      duration: 5000
    });
    survey.value = { title: "", questions: [] }
  } catch (error) {
    console.error("Erro ao salvar pesquisa:", error)
    alert("Erro ao salvar pesquisa.")
  }
}
  </script>

<style scoped>
  .create-survey-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .form-section, .preview-container {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .form-section {
    flex: 1;
    max-width: 600px;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input[type="text"],
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .questions-container {
    max-height: 60vh; /* Limita a altura */
    overflow-y: auto; /* Adiciona scroll vertical */
    padding: 16px;
    margin: 20px 0;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    scroll-behavior: smooth;
  }

  .question-card {
    margin-bottom: 20px;
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
  }

  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .add-question-btn {
    position: sticky;
    bottom: 20px;
    background: #1a73e8;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: background 0.3s;
}

.add-question-btn:hover {
  background: #1557b0;
}

.submit-button{
  position: sticky;
  bottom: 20px;
  background: #28c45c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: background 0.3s;
}

.submit-button:hover{
    bottom: 20px;
    background: #28a752;
  }

  .remove-button {
    background: #ff4444;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  .add-button {
    background: #4caf50;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
  }

  .preview-container {
    flex: 1;
    max-width: 600px;
    position: sticky;
    top: 20px;
    height: fit-content;
  }

  .preview-card {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 4px;
  }

  .preview-question {
    margin-bottom: 1rem;
  }

  .range-input input {
    width: 100%;
  }

  .radio-options,
  .checkbox-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .text-question textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    min-height: 100px;
    resize: vertical;
  }

  textarea::placeholder {
    color: #999;
    font-style: italic;
  }

  @media (max-width: 768px) {
    .create-survey-container {
      grid-template-columns: 1fr;
    }
  }
</style>
