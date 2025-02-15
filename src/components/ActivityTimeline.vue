<template>
    <div class="activity-timeline">
      <div 
        v-for="(item, index) in items"
        :key="index"
        class="timeline-item"
        :style="{ '--delay': index * 0.1 + 's' }"
      >
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-time">{{ item.time }}</div>
          <div class="timeline-text">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    items: {
      type: Array,
      required: true,
      default: () => [
        {
          time: '10:30 AM',
          text: 'Nova resposta na pesquisa "Satisfação do Cliente"'
        },
        {
          time: '09:15 AM',
          text: 'Pesquisa "Feedback de Produto" publicada'
        }
      ]
    }
  })
  </script>
  
  <style scoped>
  .activity-timeline {
    background: white;
    border-radius: 16px;
    padding: 2rem;
  }
  
  .timeline-item {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    opacity: 0;
    animation: fadeInUp 0.5s ease forwards;
    animation-delay: var(--delay);
  }
  
  .timeline-marker {
    width: 12px;
    height: 12px;
    background: #3b82f6;
    border-radius: 50%;
    margin-top: 6px;
    flex-shrink: 0;
  }
  
  .timeline-time {
    color: #64748b;
    font-size: 0.9rem;
  }
  
  .timeline-text {
    color: #1e293b;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>