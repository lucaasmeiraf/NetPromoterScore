<template>
    <div class="success-container">
      <div class="success-card">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <h2>Obrigado por responder nossa pesquisa!</h2>
        <p>Sua opinião é fundamental para melhorarmos nossos serviços.</p>
        <p>Equipe Medware</p>
      </div>
    </div>
  </template>
  
  <style scoped>
  .success-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f8f9fa;
  }
  
  .success-card {
    background: white;
    padding: 3rem;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    max-width: 600px;
    width: 90%;
  }
  
  .checkmark {
    width: 100px;
    height: 100px;
    margin-bottom: 2rem;
  }
  
  .circle {
    stroke: #1a73e8;
    stroke-width: 2;
  }
  
  .check {
    stroke: #1a73e8;
    stroke-width: 2;
    stroke-linecap: round;
  }
  
  h2 {
    color: #1a73e8;
    margin-bottom: 1rem;
  }
  
  p {
    color: #4a5568;
    line-height: 1.6;
  }
  </style>