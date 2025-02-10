<template>
  <div class="range-question">
    <div class="range-labels">
      <span>0</span>
      <span>10</span>
    </div>
    <input
      type="range"
      :min="0"
      :max="10"
      v-model="modelValue"
      class="range-input"
    />
    <div class="current-value">
      Valor selecionado: {{ modelValue || 0 }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: Object
})

const modelValue = defineModel()
</script>

<style scoped>
.range-question {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  color: #5f6368;
  font-size: 0.9rem;
}

.range-input {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  outline: none;
  -webkit-appearance: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #1a73e8;
  border-radius: 50%;
  cursor: pointer;
}

.current-value {
  text-align: center;
  color: #1a73e8;
  font-weight: 500;
  margin-top: 0.5rem;
}
</style>