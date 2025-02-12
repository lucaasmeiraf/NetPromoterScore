<template>
  <div class="container">
    <div class="confirmation-card">
      <svg class="icon" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <h2>Pesquisa Já Respondida!</h2>
      <p>Você já participou desta pesquisa. Agradecemos seu feedback!</p>
      <router-link to="/" class="return-btn">
        Voltar à Página Inicial
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.confirmation-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
}

.icon {
  width: 64px;
  height: 64px;
  color: #10B981;
  margin-bottom: 1rem;
}

.return-btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: #3B82F6;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.3s;
}

.return-btn:hover {
  background: #2563EB;
}
</style>
