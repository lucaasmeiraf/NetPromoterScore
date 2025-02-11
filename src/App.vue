<!-- src/App.vue -->
<template>
  <router-view />

  <!-- Container de Alertas -->
  <div class="alerts-container">
    <Alert
      v-for="alert in alerts"
      :key="alert.id"
      v-bind="alert"
      @close="closeAlert(alert.id)"
    />
  </div>
</template>

<script setup>
import { useAlert } from '@/composables/useAlert';
import Alert from '@/components/Alert.vue';

const { alerts, closeAlert } = useAlert();

// Seu script (se necessário)
</script>

<style>
/* Estilos globais atualizados */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

* {
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

/* Adicione isso para garantir que elementos ocupem espaço correto */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.alerts-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Viewport para mobile */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }

  .dashboard-layout {
    flex-direction: column;

    .sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #dadce0;
    }
  }
}
</style>
