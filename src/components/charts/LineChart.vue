<!-- components/LineChart.vue -->
<template>
  <div class="chart-wrapper">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

// Registra todos os componentes necessários
Chart.register(...registerables)

const props = defineProps({
  labels: {
    type: Array,
    default: () => []
  },
  datasets: {
    type: Array,
    default: () => []
  }
})

const chartCanvas = ref(null)
let chartInstance = null

onMounted(() => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: props.labels,
        datasets: props.datasets.map(dataset => ({
          ...dataset,
          borderColor: '#3b82f6',
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.05)'
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              color: 'rgba(241, 245, 249, 0.5)'
            }
          }
        }
      }
    })
  }
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})

watch(() => props.datasets, (newDatasets) => {
  if (chartInstance) {
    chartInstance.data.datasets = newDatasets
    chartInstance.update()
  }
}, { deep: true })
</script>

<style scoped>
.chart-wrapper {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  margin-top: 2rem;
}

canvas {
  width: 100% !important;
  height: 400px !important;
}
</style>
