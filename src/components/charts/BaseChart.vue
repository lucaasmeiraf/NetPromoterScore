<template>
    <div class="chart-container">
      <h3 v-if="title">{{ title }}</h3>
      <apexchart 
        :type="type"
        :options="options"
        :series="series"
        :height="height"
      ></apexchart>
    </div>
  </template>
  
  <script setup>
  defineProps({
    type: {
      type: String,
      default: 'bar'
    },
    title: String,
    options: {
      type: Object,
      default: () => ({})
    },
    series: {
      type: Array,
      required: true
    },
    height: {
      type: [String, Number],
      default: 350
    }
  })
  </script>
  
  <style scoped>
  .chart-container {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  h3 {
    margin-bottom: 1rem;
    color: #1a365d;
    font-size: 1.25rem;
  }
  </style>