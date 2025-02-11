import { ref } from 'vue';

const alerts = ref([]);

export function useAlert() {
  const showAlert = (options) => {
    const alert = {
      id: Date.now(),
      ...options
    };

    alerts.value.push(alert);

    return alert.id;
  };

  const closeAlert = (id) => {
    alerts.value = alerts.value.filter(alert => alert.id !== id);
  };

  return {
    alerts,
    showAlert,
    closeAlert
  };
}
