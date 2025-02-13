<!-- src/components/charts/NpsDistributionChart.vue -->
<template>
  <BaseChart
    title="Dashboard"
    type="donut"
    :series="series"
    :options="chartOptions"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import BaseChart from './BaseChart.vue'

const props = defineProps({
  surveyId: {
    type: String,
    required: true
  }
})

const series = ref([0, 0, 0]) // [detratores, neutros, promotores]

const chartOptions = ref({
  labels: ['Detratores (0-6)', 'Neutros (7-8)', 'Promotores (9-10)'],
  colors: ['#ef4444', '#f59e0b', '#10b981'],
  legend: {
    position: 'bottom'
  }
})

onMounted(async () => {
  try {
    const { data } = await axios.get(`http://localhost:5012/responses?surveyId=${props.surveyId}`)

    const distribution = data.reduce((acc, response) => {
      const score = response.answers.find(a => a.type === 'nps')?.value
      if (score <= 6) acc[0]++
      else if (score <= 8) acc[1]++
      else acc[2]++
      return acc
    }, [0, 0, 0])

    series.value = distribution
  } catch (error) {
    console.error('Erro ao carregar dados NPS:', error)
  }
})
</script>
