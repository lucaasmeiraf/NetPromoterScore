<template>
  <div class="dashboard-home" @mousemove="handleMouseMove">
    <div class="dashboard-container">
      <div v-if="loading" class="loading-overlay">
        <div class="loader"></div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Efeito de Partículas Interativas -->
      <div class="particles">
        <div
          v-for="(particle, index) in particles"
          :key="index"
          class="particle"
          :style="particle.style"
        ></div>
      </div>

      <!-- Conteúdo Principal -->
      <div class="main-content">
        <!-- Header com Efeito de Vidro -->
        <div class="glass-header">
          <h1>Bem-vindo ao <span class="gradient-text">Medware Analytics</span></h1>
          <p>Seu hub central de inteligência de pesquisas</p>
        </div>

        <div class="metric-grid">
          <div
            v-for="(metric, index) in metrics"
            :key="index"
            class="metric-card"
            :class="{ 'active': activeIndex === index }"
            :style="{
              transform: `translate(
                ${metric.offset.x}px,
                ${metric.offset.y}px
              )`
            }"
            @mouseenter="setActiveIndex(index)"
            @mouseleave="setActiveIndex(-1)"
            ref="metricElements"
          >
            <div class="metric-icon">{{ metric.icon }}</div>
            <div class="metric-value">
              {{ metric.currentValue }}
              <span v-if="metric.suffix">{{ metric.suffix }}</span>
            </div>
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-trend" :class="trendClass(metric)">
              {{ trendArrow(metric) }}
            </div>
          </div>
        </div>

        <!-- <div class="history-chart">
          <LineChart
            :labels="chartLabels"
            :datasets="chartData"
          />
        </div> -->

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const activeIndex = ref(-1)
const error = ref(null)
const loading = ref(true)
const metricElements = ref([]);

const npsData = ref({
  detractors: 0,
  neutrals: 0,
  promoters: 0
});

// Partículas Interativas
const particles = ref(Array.from({ length: 50 }, (_, i) => ({
  style: {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${i * 0.1}s`
  }
})))

const trendClass = (metric) => {
  const difference = metric.currentValue - metric.previousValue
  return {
    'trend-positive': difference > 0,
    'trend-negative': difference < 0
  }
}

const trendArrow = (metric) => {
  const difference = metric.currentValue - metric.previousValue
  if (difference > 0) return '⬆'
  if (difference < 0) return '⬇'
  return '➔'
}

const metrics = ref([
  {
    icon: '📊',
    label: 'Pesquisas Ativas',
    currentValue: 0,
    previousValue: 0,
    offset: { x: 0, y: 0 } // Add initial offset
  },
  {
    icon: '📈',
    label: 'Taxa de Resposta',
    currentValue: 0,
    previousValue: 0,
    suffix: '%',
    offset: { x: 0, y: 0 } // Add initial offset
  },
  {
    icon: '⭐',
    label: 'Satisfação Média',
    currentValue: 0,
    previousValue: 0,
    offset: { x: 0, y: 0 } // Add initial offset
  }
])

const calculateNPS = (responses) => {
  const scores = responses.map(response => {
    const npsQuestionIndex = response.questions.findIndex(q =>
      q.type === 'range' && q.text.toLowerCase().includes('satisfação')
    );
    return npsQuestionIndex !== -1 ? parseInt(response.answers[npsQuestionIndex]) : null;
  }).filter(score => !isNaN(score));

  const promoters = scores.filter(score => score >= 9).length;
  const detractors = scores.filter(score => score <= 6).length;

  return ((promoters - detractors) / scores.length * 100).toFixed(1);
}

const calculateResponseRate = (surveys, responses) => {
  // Considerando que cada survey foi enviado para 10 clientes (exemplo)
  const SURVEY_SENT_COUNT = 10;
  const totalPossibleResponses = surveys.length * SURVEY_SENT_COUNT;

  return totalPossibleResponses > 0
    ? ((responses.length / totalPossibleResponses) * 100).toFixed(1)
    : 0;
}

const fetchData = async () => {
  try {
    const [surveysRes, responsesRes] = await Promise.all([
      axios.get('http://localhost:5012/surveys'),
      axios.get('http://localhost:5012/responses')
    ]);

    const scores = responsesRes.data.map(response => {
      const npsQuestionIndex = response.questions.findIndex(q =>
        q.type === 'range' && q.text.toLowerCase().includes('satisfação')
      );
      return npsQuestionIndex !== -1 ? parseInt(response.answers[npsQuestionIndex]) : null;
    }).filter(score => !isNaN(score));
    const total = scores.length;

    npsData.value = {
      detractors: ((scores.filter(s => s <= 6).length / total * 100).toFixed(1)),
      neutrals: ((scores.filter(s => s > 6 && s < 9).length / total * 100).toFixed(1)),
      promoters: ((scores.filter(s => s >= 9).length / total * 100).toFixed(1))
    };

    metrics.value = [
      { ...metrics.value[0], currentValue: surveysRes.data.length },
      { ...metrics.value[1], currentValue: calculateResponseRate(surveysRes.data, responsesRes.data) },
      { ...metrics.value[2], currentValue: calculateNPS(responsesRes.data) }
    ];



  } catch (err) {
    error.value = 'Erro ao carregar dados. Tente recarregar a página.';
    console.error(err);
  }finally{
    loading.value = false
  }
}

onMounted(fetchData)
const mousePos = ref({ x: 0, y: 0 })
//const lastPosition = ref({ x: 0, y: 0 })
let rafId = ref(null)
const rafActive = ref(false)


const updateMetrics = () => {
  if (!rafActive.value) return

  metrics.value = metrics.value.map(metric => ({
    ...metric,
    offset: {
      x: mousePos.value.x * 0.015,
      y: mousePos.value.y * 0.015
    }
  }))

  rafId.value = requestAnimationFrame(updateMetrics)
}

// 3. Controle de eventos otimizado
const handleMouseMove = (e) => {
  const update = () => {
    mousePos.value = {
      x: e.clientX - window.innerWidth/2,
      y: e.clientY - window.innerHeight/2
    }
  }

  // Debounce para 60fps
  if (!rafActive.value) {
    rafActive.value = true
    update()
    rafId.value = requestAnimationFrame(updateMetrics)
  } else {
    update()
  }
}

// 4. Gestão de ciclo de vida
onMounted(() => {
  fetchData()
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  cancelAnimationFrame(rafId.value)
})

const setActiveIndex = (index) => {
  activeIndex.value = index
  if(index === -1) rafActive.value = true
  else rafActive.value = false
}
</script>

<style scoped>
.dashboard-home {
  flex: 1;
  height: 92vh;
  background: linear-gradient(45deg, #f8fafc, #e2e8f0);
  overflow: hidden;
  position: relative;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  animation: float 20s infinite linear;
}

@keyframes float {
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-100px) scale(0.8); }
  100% { transform: translateY(0) scale(1); }
}

.main-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
}

.glass-header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.05);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #3b82f6;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ef4444;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  z-index: 1000;
}

.metric-trend {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.2rem;
}

.trend-positive {
  color: #10b981;
}

.trend-negative {
  color: #ef4444;
}

.gradient-text {
  background: linear-gradient(45deg, #3b82f6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.metric-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;
  position: relative;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
}

.metric-card:hover {
  transform:
    translateY(-12px)
    scale(1.03);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  z-index: 2;
}

.metric-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.metric-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.metric-label {
  color: #64748b;
  font-size: 1rem;
}

.nps-score {
  position: relative;
  display: inline-block;
  padding: 0 1rem;
}

.nps-score::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -5px;
  height: 3px;
  background: linear-gradient(90deg,
    #ef4444 0%,
    #ef4444 33%,
    #eab308 33%,
    #eab308 66%,
    #10b981 66%,
    #10b981 100%
  );
}

.central-visual {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 3rem auto;
}

</style>
