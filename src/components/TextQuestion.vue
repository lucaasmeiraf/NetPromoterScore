<template>
  <div class="text-question">
    <textarea
      :placeholder="placeholderText"
      :value="modelValue"
      @input="handleInput"
      class="custom-textarea"
    ></textarea>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const placeholderText = computed(() => {
  return props.question.options?.placeholder || 'Digite sua resposta aqui...'
})

// Função corrigida para manipular o input
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.text-question {
  margin-top: 0.5rem;
  width: 100%;
}

.custom-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background-color: #fff;
}

.custom-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.custom-textarea::placeholder {
  color: #94a3b8;
  font-style: italic;
  opacity: 0.8;
}
</style>
