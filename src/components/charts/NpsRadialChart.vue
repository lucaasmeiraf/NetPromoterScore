<template>
  <div class="nps-radial-container">
    <apexchart
      type="radialBar"
      :options="chartOptions"
      :series="[score]"
      height="300"
    />
    <div class="radial-label">
      <div class="score">{{ score }}</div>
      <span class="label">NPS Score</span>
    </div>
  </div>
</template>

<script setup>

defineProps({
  score: {
    type: Number,
    required: true,
    default: 0,
    validator: value => value >= -100 && value <= 100
  }
})

const chartOptions = {
  chart: {
    type: 'radialBar',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    },
    foreColor: '#64748b'
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      hollow: {
        margin: 0,
        size: '70%',
        background: 'transparent'
      },
      track: {
        background: '#f1f5f9',
        strokeWidth: '100%',
        margin: 0
      },
      dataLabels: {
        show: false
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      gradientToColors: ['#3b82f6', '#60a5fa'],
      stops: [0, 100]
    }
  },
  stroke: {
    lineCap: 'round',
    dashArray: 4
  },
  labels: ['NPS Score']
}
</script>

<style scoped>
.nps-radial-container {
  position: relative;
  width: 300px;
  height: 300px;
  transition: transform 0.3s ease;
}

.nps-radial-container:hover {
  transform: scale(1.05);
}

.radial-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e40af;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.label {
  font-size: 1rem;
  color: #64748b;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: 500;
}
</style>
