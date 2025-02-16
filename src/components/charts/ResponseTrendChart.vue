<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'

Chart.register(...registerables)

const props = defineProps({
  surveyId: {
    type: String,
    required: true
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const getResponseTrend = async () => {
  try {
    const { data } = await axios.get(`http://localhost:5012/responses?surveyId=${props.surveyId}`)

    // Agrupa respostas por data
    const trends = data.reduce((acc, response) => {
      const date = new Date(response.respondedAt).toLocaleDateString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    return {
      labels: Object.keys(trends),
      data: Object.values(trends)
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    return {
      labels: [],
      data: []
    }
  }
}

onMounted(async () => {
  const trendData = await getResponseTrend()

  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trendData.labels,
        datasets: [{
          label: 'Respostas por Dia',
          data: trendData.data,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }]
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
            title: {
              display: true,
              text: 'Data',
              color: '#64748b'
            },
            grid: {
              display: false
            }
          },
          y: {
            title: {
              display: true,
              text: 'Número de Respostas',
              color: '#64748b'
            },
            grid: {
              color: 'rgba(241, 245, 249, 0.5)'
            },
            beginAtZero: true
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
</script>

<style scoped>
.chart-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

canvas {
  width: 100% !important;
  height: 400px !important;
}
</style>
