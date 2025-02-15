<template>
    <div 
      class="metric-card"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      :class="{ 'metric-hover': hover }"
    >
      <div class="metric-icon">
        <span>{{ metric.icon }}</span>
      </div>
      <div class="metric-content">
        <h3>{{ metric.title }}</h3>
        <div class="metric-value">{{ metric.value }}</div>
        <div class="metric-trend" :class="trendClass">
          <span>{{ metric.change }}%</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    metric: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        value: 0,
        change: 0,
        icon: ''
      })
    }
  })
  
  const hover = ref(false)
  
  const trendClass = computed(() => {
    return props.metric.change >= 0 ? 'trend-positive' : 'trend-negative'
  })
  </script>
  
  <style scoped>
  .metric-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  
  .metric-hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
  
  .metric-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: #f0f4ff;
    display: grid;
    place-items: center;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  .metric-value {
    font-size: 2rem;
    font-weight: 600;
    color: #1e40af;
    line-height: 1;
  }
  
  .metric-trend {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 0.9rem;
  }
  
  .trend-positive {
    background: #10b98120;
    color: #10b981;
  }
  
  .trend-negative {
    background: #ef444420;
    color: #ef4444;
  }
  </style>