<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h3>Enviar Pesquisa</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>E-mails dos Destinatários (separados por vírgula)</label>
          <textarea
            v-model="emails"
            required
            rows="4"
            placeholder="exemplo1@email.com, exemplo2@provedor.com.br"
          ></textarea>
        </div>

        <div class="modal-actions">
          <button
            type="button"
            @click="close"
            class="cancel-button"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="confirm-button"
            :disabled="sending"
          >
            <span v-if="sending">
              <span class="spinner"></span>
              Enviando...
            </span>
            <span v-else>
              Enviar Pesquisa
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  import useAlert from '@/composables/useAlert';

  const { showAlert } = useAlert();

  const emit = defineEmits(['close'])
  const props = defineProps(['surveyId'])

  const emails = ref('')

  const handleSubmit = async () => {
  try {
    const recipients = emails.value.split(',').map(e => e.trim());

    // Envio para cada destinatário
    for (const email of recipients) {
      await axios.post('http://localhost:5013/send-email', {
        to: email,
        surveyId: props.surveyId
      });
    }

    showAlert({
      type: 'success',
      title: 'E-mails Enviados',
      text: `${recipients.length} e-mail(s) enviado(s) com sucesso.`,
      duration: 5000
    });
    setTimeout(() => {
      emit('close');
    }, 300)


    } catch (error) {
      showAlert({
        type: 'error',
        title: 'Erro no Envio',
        text: 'Alguns e-mails não puderam ser enviados.',
        duration: 8000
      });
      console.log(error)
    }
};

  const close = () => emit('close')
  </script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 500px;
  }

  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .modal-actions {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .cancel-button {
    background: #f44336;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .confirm-button {
    background: #1a73e8;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .confirm-button:disabled {
    background: #1a73e899;
    cursor: not-allowed;
  }

  textarea::placeholder {
    color: #999;
    font-style: italic;
  }

  .spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}


@keyframes spin {
  to { transform: rotate(360deg); }
}

  </style>
