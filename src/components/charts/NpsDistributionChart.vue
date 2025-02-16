<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'

Chart.register(...registerables)

const props = defineProps({
  surveyId: String,
  startDate: String,
  endDate: String,
  userId: String
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

const chartCanvas = ref(null)
let chartInstance = null

const getNpsDistribution = async () => {
  try {
    let url = `http://localhost:5012/responses?surveyId=${props.surveyId}`

    // Adiciona filtros formatados corretamente
    if(props.startDate) {
      url += `&respondedAt_gte=${formatDate(props.startDate)}T00:00:00.000Z`
    }
    if(props.endDate) {
      url += `&respondedAt_lte=${formatDate(props.endDate)}T23:59:59.999Z`
    }
    if(props.userId) {
      url += `&userId=${props.userId}`
    }

    //console.log('API URL:', url) // Para debug

    const { data } = await axios.get(url)

    const scores = data.flatMap(response =>
      response.questions
        .map((question, index) => ({
          type: question.type,
          value: response.answers[index],
          respondedAt: response.respondedAt
        }))
        .filter(q => q.type === 'range')
        .map(q => parseInt(q.value))
        .filter(score => !isNaN(score) && score >= 0 && score <= 10))

    // Agrupa por pontuação
    const distribution = Array(11).fill(0)
    scores.forEach(score => distribution[score]++)

    //console.log('Distribution data:', distribution) // Para debug
    return distribution

  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    return Array(11).fill(0)
  }
}

watch(() => [props.startDate, props.endDate, props.userId], async () => {
  try {
    const distribution = await getNpsDistribution()
    if(chartInstance) {
      chartInstance.data.datasets[0].data = distribution
      chartInstance.update()
      //console.log('Chart updated with new data') // Para debug
    }
  } catch (error) {
    console.error('Erro ao atualizar gráfico:', error)
  }
}, { deep: true })

onMounted(async () => {
  const distribution = await getNpsDistribution()

  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [{
          label: 'Distribuição NPS',
          data: distribution,
          backgroundColor: Array.from({length: 11}, (_, i) => {
            if(i >= 9) return '#10b981'    // Verde para promotores
            if(i >= 7) return '#eab308'    // Amarelo para neutros
            return '#ef4444'               // Vermelho para detratores
          }),
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw
                return `${value} ${value === 1 ? 'resposta' : 'respostas'}`
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Pontuação NPS',
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
