<template>
    <div class="radial-chart">
      <apexchart 
        type="radialBar"
        :options="chartOptions"
        :series="[score]"
        height="350"
      />
      <div class="chart-label">
        <span>NPS Score</span>
        <div class="score">{{ score }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    score: Number
  })
  
  const chartOptions = {
    chart: {
      type: 'radialBar',
      animations: {
        enabled: true,
        speed: 800
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: '70%',
        },
        dataLabels: {
          show: false
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        gradientToColors: ['#3b82f6'],
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    }
  }
  </script>
  
  <style scoped>
  .radial-chart {
    position: relative;
    margin: 2rem 0;
  }
  
  .chart-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  
  .score {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e40af;
  }
  </style>