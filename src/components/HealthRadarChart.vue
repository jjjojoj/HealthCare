<template>
  <view class="health-radar-chart">
    <!-- H5 使用原生 ECharts -->
    <!-- #ifdef H5 -->
    <view ref="chartContainer" class="chart-container" id="health-radar"></view>
    <!-- #endif -->

    <!-- 小程序使用 canvas -->
    <!-- #ifndef H5 -->
    <canvas
      canvas-id="health-radar"
      id="health-radar"
      class="chart-container"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    ></canvas>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
// #ifdef H5
import * as echarts from 'echarts'
// #endif

// #ifndef H5
// 小程序环境需要特殊处理
import * as echarts from '../../node_modules/echarts/dist/echarts.js'
// #endif

const props = defineProps({
  healthMetrics: {
    type: Array,
    default: () => []
  },
  healthScore: {
    type: Number,
    default: 0
  }
})

let chartInstance = null

// 初始化图表
const initChart = () => {
  if (!props.healthMetrics || props.healthMetrics.length === 0) return

  // #ifdef H5
  const container = document.getElementById('health-radar')
  if (!container) return
  chartInstance = echarts.init(container)
  // #endif

  // #ifndef H5
  const ctx = uni.createCanvasContext('health-radar')
  chartInstance = echarts.init(ctx, null, {
    width: 750,
    height: 600,
    devicePixelRatio: 2
  })
  // #endif

  // 构建雷达图配置
  const indicator = props.healthMetrics.map(metric => ({
    name: metric.name,
    max: metric.max * 1.2, // 最大值设为正常上限的1.2倍
  }))

  const actualValues = props.healthMetrics.map(m => m.value)
  const normalMaxValues = props.healthMetrics.map(m => m.max)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const metric = props.healthMetrics[params.dataIndex]
        return `${metric.name}<br/>当前值: ${metric.value}${metric.unit}<br/>正常范围: ${metric.min}-${metric.max}${metric.unit}<br/>状态: ${metric.statusText}`
      }
    },
    legend: {
      bottom: 10,
      data: ['当前值', '正常上限'],
      textStyle: {
        fontSize: 12
      }
    },
    radar: {
      center: ['50%', '50%'],
      radius: '70%',
      indicator: indicator,
      name: {
        textStyle: {
          fontSize: 12,
          color: '#333',
          fontWeight: 'bold'
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(55, 205, 135, 0.05)', 'rgba(55, 205, 135, 0.1)',
                  'rgba(55, 205, 135, 0.15)', 'rgba(55, 205, 135, 0.2)']
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.15)'
        }
      }
    },
    series: [
      {
        name: '正常上限',
        type: 'radar',
        symbol: 'none',
        lineStyle: {
          width: 2,
          type: 'dashed',
          color: 'rgba(55, 205, 135, 0.5)'
        },
        areaStyle: {
          color: 'rgba(55, 205, 135, 0.1)'
        },
        data: [{
          value: normalMaxValues,
          name: '正常上限'
        }]
      },
      {
        name: '当前值',
        type: 'radar',
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: getScoreColor()
        },
        areaStyle: {
          color: getScoreColorWithOpacity(0.3)
        },
        itemStyle: {
          color: getScoreColor(),
          borderWidth: 2,
          borderColor: '#fff'
        },
        data: [{
          value: actualValues,
          name: '当前值'
        }]
      }
    ]
  }

  chartInstance.setOption(option)
}

// 根据健康评分获取颜色
const getScoreColor = () => {
  const score = props.healthScore
  if (score >= 90) return '#37CD87' // 优秀 - 绿色
  if (score >= 80) return '#4FACFE' // 良好 - 蓝色
  if (score >= 70) return '#FFAB40' // 中等 - 橙色
  if (score >= 60) return '#FA709A' // 及格 - 粉色
  return '#FF5252' // 需改善 - 红色
}

const getScoreColorWithOpacity = (opacity) => {
  const color = getScoreColor()
  // 将 hex 转换为 rgba
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// 触摸事件处理（小程序需要）
const touchStart = (e) => {
  if (chartInstance && chartInstance.dispatchAction) {
    chartInstance.dispatchAction({
      type: 'highlight',
      seriesIndex: 1
    })
  }
}

const touchMove = (e) => {
  // 处理触摸移动
}

const touchEnd = (e) => {
  if (chartInstance && chartInstance.dispatchAction) {
    chartInstance.dispatchAction({
      type: 'downplay',
      seriesIndex: 1
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    initChart()
  }, 300)
})

// 监听数据变化重新渲染
watch(() => props.healthMetrics, () => {
  if (chartInstance) {
    initChart()
  }
}, { deep: true })
</script>

<style scoped lang="scss">
.health-radar-chart {
  width: 100%;
  padding: 20rpx;
}

.chart-container {
  width: 100%;
  height: 600rpx; /* 与综合评分卡片高度保持一致 */
  border-radius: var(--radius-xl);
  background: white;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}
</style>
