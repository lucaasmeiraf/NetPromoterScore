<template>
    <div class="radio-question">
      <label 
        v-for="(option, index) in question.options" 
        :key="index"
        class="radio-option"
      >
        <input 
          type="radio" 
          :value="option.text" 
          v-model="modelValue"
          :name="'question-' + question.id"
        />
        <span class="radiomark"></span>
        {{ option.text || `Opção ${index + 1}` }}
      </label>
    </div>
  </template>
  
  <script setup>
  defineProps({
    question: Object
  })
  
  const modelValue = defineModel()
  </script>
  
  <style scoped>
  .radio-question {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .radio-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    cursor: pointer;
    user-select: none;
  }
  
  .radio-option input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  
  .radiomark {
    position: relative;
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 2px solid #1a73e8;
    border-radius: 50%;
    transition: all 0.3s;
  }
  
  .radio-option input:checked ~ .radiomark {
    background-color: #1a73e8;
  }
  
  .radiomark::after {
    content: "";
    position: absolute;
    display: none;
    top: 4px;
    left: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }
  
  .radio-option input:checked ~ .radiomark::after {
    display: block;
  }
  </style>