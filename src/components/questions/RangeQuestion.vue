<template>
  <div class="range-grid">
    <div class="labels">
      <span>{{ question?.options?.minLabel || '0' }}</span>
      <span>{{ question?.options?.maxLabel || '10' }}</span>
    </div>

    <div class="grid-container">
      <div
        v-for="n in (max - min + 1)"
        :key="n"
        class="grid-item"
        :class="{
          selected: n <= modelValue,
          hovered: n <= hoverValue,
          promoter: n >= promoterStart,
          neutral: n >= neutralStart && n < promoterStart,
          detractor: n < neutralStart
        }"
        @mouseover="hoverValue = n"
        @mouseleave="hoverValue = 0"
        @click="modelValue = n"
      ></div>
    </div>

    <div class="selected-value">
      {{ question?.options?.valueLabel || '' }} {{ modelValue || min }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    default: () => ({
      options: {
        min: 0,
        max: 10,
        minLabel: '0',
        maxLabel: '10',
        valueLabel: ''
      }
    })
  }
})

const modelValue = defineModel()
const hoverValue = ref(0)

const min = computed(() => props.question?.options?.min || 1)
const max = computed(() => props.question?.options?.max || 10)

const neutralStart = computed(() => Math.floor(max.value * 0.6) + 1)
const promoterStart = computed(() => Math.floor(max.value * 0.8) + 1)

watchEffect(() => {
  if (modelValue.value === undefined) {
    modelValue.value = min.value
  }
})
</script>

<style scoped>
.range-grid {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.labels {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 0.9rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 4px;
}

.grid-item {
  height: 40px;
  background-color: #f1f5f9;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
  position: relative;
}

.grid-item:hover {
  transform: scale(1.05);
  z-index: 1;
}

.grid-item.hovered {
  background-color: #e2e8f0;
}

.grid-item.selected {
  border-color: #334155;
}

/* Categorias NPS */
.grid-item.detractor.selected {
  background-color: #ef4444;
  border-color: #dc2626;
}

.grid-item.neutral.selected {
  background-color: #f59e0b;
  border-color: #d97706;
}

.grid-item.promoter.selected {
  background-color: #10b981;
  border-color: #059669;
}

.selected-value {
  text-align: center;
  font-weight: 500;
  color: #334155;
  margin-top: 0.8rem;
  font-size: 1.1rem;
}

/* Responsividade */
@media (max-width: 640px) {
  .grid-item {
    height: 35px;
  }

  .selected-value {
    font-size: 1rem;
  }
}
</style>
