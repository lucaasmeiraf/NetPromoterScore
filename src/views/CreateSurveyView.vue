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
          <button type="button" @click="addQuestion" class="add-button">Adicionar Pergunta</button>
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
              <input type="range" min="0" max="10" />
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
          </div>
        </div>
      </div>
    </div>
</template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { formatDate } from '@/utils/dateFormatter';
  
  // Estado da pesquisa
  const survey = ref({
    title: "",
    questions: [],
  });
  
  // Adicionar nova pergunta
  const addQuestion = () => {
    survey.value.questions.push({
      text: "",
      type: "range",
      options: [],
    });
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
      createdAt: formatDate,
      updatedBy: user.email,
      updatedAt: formatDate
    }
    
    await axios.post('http://localhost:5012/surveys', surveyWithDate)
    alert("Pesquisa salva com sucesso!")
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
    margin-top: 2rem;
  }
  
  .question-card {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
  }
  
  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  @media (max-width: 768px) {
    .create-survey-container {
      grid-template-columns: 1fr;
    }
  }
</style>