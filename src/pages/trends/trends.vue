<template>
  <view class="page">
    <AppHeader title="健康趋势" :show-back="true" />

    <scroll-view scroll-y class="content">
      <!-- 时间范围选择器 -->
      <view class="time-selector">
        <view 
          v-for="range in timeRanges" 
          :key="range.value"
          class="time-btn"
          :class="{ active: selectedRange === range.value }"
          @click="changeTimeRange(range.value)"
        >
          {{ range.label }}
        </view>
      </view>

      <!-- 血压趋势 -->
      <view class="chart-card">
        <view class="card-header">
          <view class="card-title">
            <view class="icon">🩺</view>
            <text class="title-text">血压趋势</text>
          </view>
          <view class="unit-badge">mmHg</view>
        </view>

        <!-- 统计数据 -->
        <view class="stats-row">
          <view class="stat-item">
            <view class="stat-label">收缩压平均</view>
            <view class="stat-value">{{ bpStats.systolic.avg }} <text class="stat-unit">mmHg</text></view>
            <view class="stat-change" :class="getChangeClass(bpStats.systolic.change)">
              {{ bpStats.systolic.change > 0 ? '↑' : '↓' }} {{ Math.abs(bpStats.systolic.change).toFixed(1) }}%
            </view>
          </view>
          <view class="stat-item">
            <view class="stat-label">舒张压平均</view>
            <view class="stat-value">{{ bpStats.diastolic.avg }} <text class="stat-unit">mmHg</text></view>
            <view class="stat-change" :class="getChangeClass(bpStats.diastolic.change)">
              {{ bpStats.diastolic.change > 0 ? '↑' : '↓' }} {{ Math.abs(bpStats.diastolic.change).toFixed(1) }}%
            </view>
          </view>
        </view>

        <!-- ECharts 图表容器 -->
        <view class="chart-wrapper">
          <canvas 
            canvas-id="bp-chart" 
            id="bp-chart" 
            class="ec-canvas"
            @touchstart="disableScroll" 
            @touchend="enableScroll"
          ></canvas>
        </view>
      </view>

      <!-- 心率趋势 -->
      <view class="chart-card">
        <view class="card-header">
          <view class="card-title">
            <view class="icon">❤️</view>
            <text class="title-text">心率趋势</text>
          </view>
          <view class="unit-badge">bpm</view>
        </view>

        <!-- 统计数据 -->
        <view class="stats-row">
          <view class="stat-item">
            <view class="stat-label">平均心率</view>
            <view class="stat-value">{{ hrStats.avg }} <text class="stat-unit">bpm</text></view>
            <view class="stat-change" :class="getChangeClass(hrStats.change)">
              {{ hrStats.change > 0 ? '↑' : '↓' }} {{ Math.abs(hrStats.change).toFixed(1) }}%
            </view>
          </view>
          <view class="stat-item">
            <view class="stat-label">近7天变化</view>
            <view class="stat-value">{{ hrStats.last7Avg }} <text class="stat-unit">bpm</text></view>
            <view class="stat-trend" :class="hrStats.trend === 'up' ? 'trend-up' : 'trend-down'">
              {{ hrStats.trend === 'up' ? '上升' : '下降' }}
            </view>
          </view>
        </view>

        <!-- ECharts 图表容器 -->
        <view class="chart-wrapper">
          <canvas 
            canvas-id="hr-chart" 
            id="hr-chart" 
            class="ec-canvas"
            @touchstart="disableScroll" 
            @touchend="enableScroll"
          ></canvas>
        </view>
      </view>

      <!-- 血糖趋势 -->
      <view class="chart-card">
        <view class="card-header">
          <view class="card-title">
            <view class="icon">🩸</view>
            <text class="title-text">血糖趋势</text>
          </view>
          <view class="unit-badge">mmol/L</view>
        </view>

        <!-- 统计数据 -->
        <view class="stats-row">
          <view class="stat-item">
            <view class="stat-label">平均血糖</view>
            <view class="stat-value">{{ bgStats.avg }} <text class="stat-unit">mmol/L</text></view>
            <view class="stat-change" :class="getChangeClass(bgStats.change)">
              {{ bgStats.change > 0 ? '↑' : '↓' }} {{ Math.abs(bgStats.change).toFixed(1) }}%
            </view>
          </view>
          <view class="stat-item">
            <view class="stat-label">近7天变化</view>
            <view class="stat-value">{{ bgStats.last7Avg }} <text class="stat-unit">mmol/L</text></view>
            <view class="stat-trend" :class="bgStats.trend === 'up' ? 'trend-up' : 'trend-down'">
              {{ bgStats.trend === 'up' ? '上升' : '下降' }}
            </view>
          </view>
        </view>

        <!-- ECharts 图表容器 -->
        <view class="chart-wrapper">
          <canvas 
            canvas-id="bg-chart" 
            id="bg-chart" 
            class="ec-canvas"
            @touchstart="disableScroll" 
            @touchend="enableScroll"
          ></canvas>
        </view>
      </view>

      <!-- 健康建议 -->
      <view class="advice-card">
        <view class="advice-header">
          <view class="advice-icon">💡</view>
          <text class="advice-title">健康建议</text>
        </view>
        <view class="advice-list">
          <view v-for="(advice, index) in healthAdvice" :key="index" class="advice-item">
            <view class="advice-dot"></view>
            <text class="advice-text">{{ advice }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <BottomNav />
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import * as echarts from 'echarts'
import metricsData from '@/static/mock/metrics.json'
import { useAuthGuard } from '@/composables/useAuthGuard'

useAuthGuard()

// 时间范围选项
const timeRanges = ref([
  { label: '7天', value: 7 },
  { label: '30天', value: 30 },
  { label: '全部', value: 0 }
])

const selectedRange = ref(30)

// 图表实例
let bpChart = null
let hrChart = null
let bgChart = null

// 是否禁用滚动（触摸图表时）
const scrollEnabled = ref(true)

// 解析和分组原始数据
const parseMetrics = () => {
  const systolic = []
  const diastolic = []
  const heartRate = []
  const bloodGlucose = []

  metricsData.metrics.forEach(item => {
    const dateStr = item.timestamp.split('T')[0]
    
    if (item.metric_name === 'blood_pressure_systolic') {
      systolic.push({ date: dateStr, value: item.value })
    } else if (item.metric_name === 'blood_pressure_diastolic') {
      diastolic.push({ date: dateStr, value: item.value })
    } else if (item.metric_name === 'heart_rate') {
      heartRate.push({ date: dateStr, value: item.value })
    } else if (item.metric_name === 'blood_glucose') {
      bloodGlucose.push({ date: dateStr, value: item.value })
    }
  })

  return { systolic, diastolic, heartRate, bloodGlucose }
}

const allMetrics = parseMetrics()

// 根据时间范围筛选数据
const filterDataByRange = (data, range) => {
  if (range === 0) return data // 全部
  return data.slice(-range)
}

// 当前显示的数据
const currentData = computed(() => {
  const range = selectedRange.value
  return {
    systolic: filterDataByRange(allMetrics.systolic, range),
    diastolic: filterDataByRange(allMetrics.diastolic, range),
    heartRate: filterDataByRange(allMetrics.heartRate, range),
    bloodGlucose: filterDataByRange(allMetrics.bloodGlucose, range)
  }
})

// 计算统计数据
const calculateStats = (data, last7Data) => {
  if (!data || data.length === 0) return { avg: 0, change: 0, last7Avg: 0, trend: 'stable' }

  const values = data.map(item => item.value)
  const avg = (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1)

  // 近7天数据
  const last7Values = last7Data.map(item => item.value)
  const last7Avg = last7Values.length > 0 
    ? (last7Values.reduce((sum, val) => sum + val, 0) / last7Values.length).toFixed(1)
    : avg

  // 前7天数据（用于对比）
  const previous7Data = data.slice(-14, -7)
  const previous7Values = previous7Data.length > 0 
    ? previous7Data.map(item => item.value)
    : last7Values

  const previous7Avg = previous7Values.length > 0
    ? previous7Values.reduce((sum, val) => sum + val, 0) / previous7Values.length
    : parseFloat(avg)

  // 计算变化百分比
  const change = previous7Avg !== 0 
    ? (((parseFloat(last7Avg) - previous7Avg) / previous7Avg) * 100)
    : 0

  // 趋势
  const trend = parseFloat(last7Avg) > previous7Avg ? 'up' : 'down'

  return { avg, change, last7Avg, trend }
}

// 血压统计
const bpStats = computed(() => {
  const data = currentData.value
  const last7Systolic = filterDataByRange(allMetrics.systolic, 7)
  const last7Diastolic = filterDataByRange(allMetrics.diastolic, 7)

  return {
    systolic: calculateStats(data.systolic, last7Systolic),
    diastolic: calculateStats(data.diastolic, last7Diastolic)
  }
})

// 心率统计
const hrStats = computed(() => {
  const data = currentData.value.heartRate
  const last7 = filterDataByRange(allMetrics.heartRate, 7)
  return calculateStats(data, last7)
})

// 血糖统计
const bgStats = computed(() => {
  const data = currentData.value.bloodGlucose
  const last7 = filterDataByRange(allMetrics.bloodGlucose, 7)
  return calculateStats(data, last7)
})

// 健康建议
const healthAdvice = computed(() => {
  const advice = []
  
  // 血压建议
  const systolicAvg = parseFloat(bpStats.value.systolic.avg)
  if (systolicAvg > 130) {
    advice.push('您的收缩压偏高，建议减少盐分摄入，保持规律运动')
  } else if (systolicAvg < 90) {
    advice.push('您的收缩压偏低，建议适当增加营养摄入')
  } else {
    advice.push('您的血压处于正常范围，请继续保持良好的生活习惯')
  }

  // 心率建议
  const hrAvg = parseFloat(hrStats.value.avg)
  if (hrAvg > 100) {
    advice.push('您的心率偏高，建议减少咖啡因摄入，保持充足睡眠')
  } else if (hrAvg < 60) {
    advice.push('您的静息心率较低，这通常是良好体能的标志')
  }

  // 血糖建议
  const bgAvg = parseFloat(bgStats.value.avg)
  if (bgAvg > 6.1) {
    advice.push('您的空腹血糖偏高，建议控制糖分和碳水摄入，增加运动')
  } else if (bgAvg < 3.9) {
    advice.push('您的血糖偏低，建议规律进餐，避免过度运动')
  } else {
    advice.push('您的血糖控制良好，请继续保持')
  }

  // 趋势建议
  if (bpStats.value.systolic.change < -5) {
    advice.push('近期血压下降明显，效果显著！继续保持当前的健康管理方式')
  }

  return advice
})

// 获取变化样式类
const getChangeClass = (change) => {
  if (change > 0) return 'change-up'
  if (change < 0) return 'change-down'
  return 'change-stable'
}

// 禁用/启用滚动
const disableScroll = () => {
  scrollEnabled.value = false
}

const enableScroll = () => {
  scrollEnabled.value = true
}

// 切换时间范围
const changeTimeRange = (range) => {
  selectedRange.value = range
  nextTick(() => {
    updateCharts()
  })
}

// 初始化血压图表
const initBPChart = () => {
  const canvas = document.getElementById('bp-chart')
  if (!canvas) return

  bpChart = echarts.init(canvas, null, {
    width: canvas.offsetWidth || 350,
    height: 300
  })

  updateBPChart()
}

// 更新血压图表
const updateBPChart = () => {
  if (!bpChart) return

  const data = currentData.value
  const dates = data.systolic.map(item => item.date.slice(5))
  const systolicValues = data.systolic.map(item => item.value)
  const diastolicValues = data.diastolic.map(item => item.value)

  const option = {
    grid: {
      left: 50,
      right: 20,
      top: 50,
      bottom: 30
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: (params) => {
        let result = `${params[0].axisValue}<br/>`
        params.forEach(item => {
          result += `${item.marker} ${item.seriesName}: ${item.value} mmHg<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['收缩压', '舒张压'],
      top: 10,
      textStyle: {
        fontSize: 12
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: { color: '#e0e0e0' }
      },
      axisLabel: {
        fontSize: 10,
        color: '#666',
        interval: dates.length > 20 ? Math.floor(dates.length / 10) : 0
      }
    },
    yAxis: {
      type: 'value',
      name: 'mmHg',
      nameTextStyle: {
        fontSize: 11,
        color: '#999'
      },
      axisLine: {
        lineStyle: { color: '#e0e0e0' }
      },
      axisLabel: {
        fontSize: 10,
        color: '#666'
      },
      splitLine: {
        lineStyle: { color: '#f0f0f0' }
      }
    },
    series: [
      {
        name: '收缩压',
        type: 'line',
        data: systolicValues,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#37CD87' },
              { offset: 1, color: '#2DB873' }
            ]
          }
        },
        itemStyle: {
          color: '#37CD87'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(55, 205, 135, 0.3)' },
              { offset: 1, color: 'rgba(55, 205, 135, 0.05)' }
            ]
          }
        }
      },
      {
        name: '舒张压',
        type: 'line',
        data: diastolicValues,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#f093fb' },
              { offset: 1, color: '#f5576c' }
            ]
          }
        },
        itemStyle: {
          color: '#f093fb'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(240, 147, 251, 0.3)' },
              { offset: 1, color: 'rgba(240, 147, 251, 0.05)' }
            ]
          }
        }
      }
    ]
  }

  bpChart.setOption(option)
}

// 初始化心率图表
const initHRChart = () => {
  const canvas = document.getElementById('hr-chart')
  if (!canvas) return

  hrChart = echarts.init(canvas, null, {
    width: canvas.offsetWidth || 350,
    height: 300
  })

  updateHRChart()
}

// 更新心率图表
const updateHRChart = () => {
  if (!hrChart) return

  const data = currentData.value.heartRate
  const dates = data.map(item => item.date.slice(5))
  const values = data.map(item => item.value)

  const option = {
    grid: {
      left: 50,
      right: 20,
      top: 40,
      bottom: 30
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: (params) => {
        return `${params[0].axisValue}<br/>${params[0].marker} 心率: ${params[0].value} bpm`
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: { color: '#e0e0e0' }
      },
      axisLabel: {
        fontSize: 10,
        color: '#666',
        interval: dates.length > 20 ? Math.floor(dates.length / 10) : 0
      }
    },
    yAxis: {
      type: 'value',
      name: 'bpm',
      nameTextStyle: {
        fontSize: 11,
        color: '#999'
      },
      axisLine: {
        lineStyle: { color: '#e0e0e0' }
      },
      axisLabel: {
        fontSize: 10,
        color: '#666'
      },
      splitLine: {
        lineStyle: { color: '#f0f0f0' }
      }
    },
    series: [
      {
        name: '心率',
        type: 'line',
        data: values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#fa709a' },
              { offset: 1, color: '#fee140' }
            ]
          }
        },
        itemStyle: {
          color: '#fa709a'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(250, 112, 154, 0.3)' },
              { offset: 1, color: 'rgba(250, 112, 154, 0.05)' }
            ]
          }
        }
      }
    ]
  }

  hrChart.setOption(option)
}

// 初始化血糖图表
const initBGChart = () => {
  const canvas = document.getElementById('bg-chart')
  if (!canvas) return

  bgChart = echarts.init(canvas, null, {
    width: canvas.offsetWidth || 350,
    height: 300
  })

  updateBGChart()
}

// 更新血糖图表
const updateBGChart = () => {
  if (!bgChart) return

  const data = currentData.value.bloodGlucose
  const dates = data.map(item => item.date.slice(5))
  const values = data.map(item => item.value)

  const option = {
    grid: {
      left: 50,
      right: 20,
      top: 40,
      bottom: 30
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: (params) => {
        return `${params[0].axisValue}<br/>${params[0].marker} 血糖: ${params[0].value} mmol/L`
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: {
        lineStyle: { color: '#e0e0e0' }
      },
      axisLabel: {
        fontSize: 10,
        color: '#666',
        interval: dates.length > 20 ? Math.floor(dates.length / 10) : 0
      }
    },
    yAxis: {
      type: 'value',
      name: 'mmol/L',
      nameTextStyle: {
        fontSize: 11,
        color: '#999'
      },
      axisLine: {
        lineStyle: { color: '#e0e0e0' }
      },
      axisLabel: {
        fontSize: 10,
        color: '#666'
      },
      splitLine: {
        lineStyle: { color: '#f0f0f0' }
      }
    },
    series: [
      {
        name: '血糖',
        type: 'line',
        data: values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#4facfe' },
              { offset: 1, color: '#00f2fe' }
            ]
          }
        },
        itemStyle: {
          color: '#4facfe'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(79, 172, 254, 0.3)' },
              { offset: 1, color: 'rgba(79, 172, 254, 0.05)' }
            ]
          }
        },
        markLine: {
          silent: true,
          lineStyle: {
            color: '#ff4d4f',
            type: 'dashed',
            width: 2
          },
          data: [
            { yAxis: 6.1, label: { formatter: '正常上限 6.1', position: 'end' } }
          ]
        }
      }
    ]
  }

  bgChart.setOption(option)
}

// 更新所有图表
const updateCharts = () => {
  updateBPChart()
  updateHRChart()
  updateBGChart()
}

// 响应式调整
const handleResize = () => {
  if (bpChart) bpChart.resize()
  if (hrChart) hrChart.resize()
  if (bgChart) bgChart.resize()
}

// 生命周期
onMounted(() => {
  // #ifdef H5
  nextTick(() => {
    initBPChart()
    initHRChart()
    initBGChart()
    
    window.addEventListener('resize', handleResize)
  })
  // #endif
})

onUnmounted(() => {
  // #ifdef H5
  if (bpChart) bpChart.dispose()
  if (hrChart) hrChart.dispose()
  if (bgChart) bgChart.dispose()
  
  window.removeEventListener('resize', handleResize)
  // #endif
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f7ff 0%, #f5f5f5 100%);
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 20rpx 16rpx;
  padding-bottom: 120rpx;
}

/* 时间选择器 */
.time-selector {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
  background: white;
  padding: 12rpx;
  border-radius: 14rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.time-btn {
  flex: 1;
  padding: 14rpx;
  text-align: center;
  font-size: 26rpx;
  color: #666;
  background: #f5f5f5;
  border-radius: 10rpx;
  transition: all 0.3s ease;
  font-weight: 500;
}

.time-btn.active {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(55, 205, 135, 0.3);
  transform: translateY(-2rpx);
}

/* 图表卡片 */
.chart-card {
  background: white;
  border-radius: 18rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.icon {
  font-size: 36rpx;
}

.title-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #262626;
}

.unit-badge {
  padding: 8rpx 16rpx;
  background: #f0f0f0;
  border-radius: 20rpx;
  font-size: 22rpx;
  color: #8c8c8c;
  font-weight: 500;
}

/* 统计数据行 */
.stats-row {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.stat-item {
  flex: 1;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f7ff 100%);
  padding: 16rpx;
  border-radius: 10rpx;
  border: 2rpx solid #e6f7ff;
}

.stat-label {
  font-size: 22rpx;
  color: #8c8c8c;
  margin-bottom: 6rpx;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #37CD87;
  margin-bottom: 6rpx;
}

.stat-unit {
  font-size: 20rpx;
  font-weight: 400;
  color: #8c8c8c;
}

.stat-change {
  font-size: 24rpx;
  font-weight: 600;
  display: inline-block;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.change-up {
  background: #fff1f0;
  color: #ff4d4f;
}

.change-down {
  background: #f6ffed;
  color: #52c41a;
}

.change-stable {
  background: #f0f0f0;
  color: #8c8c8c;
}

.stat-trend {
  font-size: 24rpx;
  font-weight: 600;
  display: inline-block;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.trend-up {
  background: #fff1f0;
  color: #ff4d4f;
}

.trend-down {
  background: #f6ffed;
  color: #52c41a;
}

/* 图表容器 */
.chart-wrapper {
  width: 100%;
  height: 300px;
  position: relative;
}

.ec-canvas {
  width: 100%;
  height: 100%;
}

/* 健康建议卡片 */
.advice-card {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  border-radius: 18rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(55, 205, 135, 0.3);
}

.advice-header {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 16rpx;
}

.advice-icon {
  font-size: 36rpx;
}

.advice-title {
  font-size: 30rpx;
  font-weight: 600;
  color: white;
}

.advice-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.advice-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.advice-dot {
  width: 12rpx;
  height: 12rpx;
  background: white;
  border-radius: 50%;
  margin-top: 12rpx;
  flex-shrink: 0;
}

.advice-text {
  flex: 1;
  font-size: 26rpx;
  color: white;
  line-height: 1.6;
  opacity: 0.95;
}
</style>
