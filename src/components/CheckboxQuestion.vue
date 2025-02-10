<template>
    <div class="checkbox-question">
      <label 
        v-for="(option, index) in question.options" 
        :key="index"
        class="checkbox-option"
      >
        <input 
          type="checkbox" 
          :value="option.text" 
          v-model="modelValue"
        />
        <span class="checkmark"></span>
        {{ option.text || `Opção ${index + 1}` }}
      </label>
    </div>
  </template>
  
  <script setup>
  defineProps({
    question: Object
  })
  
  const modelValue = defineModel({
    type: Array,
    default: () => []
  })
  </script>
  
  <style scoped>
  .checkbox-question {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .checkbox-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    cursor: pointer;
    user-select: none;
  }
  
  .checkbox-option input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  
  .checkmark {
    position: relative;
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 2px solid #1a73e8;
    border-radius: 4px;
    transition: all 0.3s;
  }
  
  .checkbox-option input:checked ~ .checkmark {
    background-color: #1a73e8;
  }
  
  .checkmark::after {
    content: "";
    position: absolute;
    display: none;
    left: 5px;
    top: 1px;
    width: 4px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  
  .checkbox-option input:checked ~ .checkmark::after {
    display: block;
  }
  </style>