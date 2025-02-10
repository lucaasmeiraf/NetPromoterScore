<template>
    <transition name="alert">
      <div v-if="isVisible" :class="['alert', type]" role="alert">
        <div class="alert-content">
          <div class="icon">
            <svg v-if="type === 'success'" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <svg v-if="type === 'error'" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <div class="message">
            <h3>{{ title }}</h3>
            <p>{{ text }}</p>
          </div>
          <button @click="close" class="close-btn">
            &times;
          </button>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'info'].includes(value)
    },
    title: String,
    text: String,
    duration: {
      type: Number,
      default: 4000
    }
  });
  
  const isVisible = ref(true);
  
  const close = () => {
    isVisible.value = false;
  };
  
  // Fechar automaticamente
  if (props.duration > 0) {
    setTimeout(() => close(), props.duration);
  }
  </script>
  
  <style scoped>
  .alert {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    min-width: 300px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .alert-content {
    display: flex;
    align-items: center;
    padding: 16px;
    border-left: 6px solid;
  }
  
  .success {
    border-color: #34A853;
    background: linear-gradient(145deg, #f6fff2, #ffffff);
  }
  
  .error {
    border-color: #EA4335;
    background: linear-gradient(145deg, #fff5f5, #ffffff);
  }
  
  .icon {
    margin-right: 16px;
  }
  
  .icon svg {
    width: 32px;
    height: 32px;
  }
  
  .success .icon svg {
    color: #34A853;
  }
  
  .error .icon svg {
    color: #EA4335;
  }
  
  .message h3 {
    margin: 0;
    color: #2D3748;
    font-size: 16px;
    font-weight: 600;
  }
  
  .message p {
    margin: 4px 0 0;
    color: #718096;
    font-size: 14px;
  }
  
  .close-btn {
    margin-left: auto;
    background: none;
    border: none;
    color: #A0AEC0;
    font-size: 24px;
    cursor: pointer;
    padding: 0 8px;
    transition: color 0.2s;
  }
  
  .close-btn:hover {
    color: #718096;
  }
  
  /* Animações */
  .alert-enter-from,
  .alert-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
  
  .alert-enter-to,
  .alert-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
  
  .alert-enter-active,
  .alert-leave-active {
    transition: all 0.4s ease;
  }
  </style>