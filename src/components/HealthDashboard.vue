<template>
  <view class="health-dashboard">
    <!-- 健康仪表盘主体 - 改进版 -->
    <view class="dashboard-main">
      <!-- 左侧：综合评分卡片 -->
      <view class="score-card-section">
        <HealthScoreCard :score="healthScore" />
      </view>

      <!-- 右侧：健康指标概览 -->
      <view class="metrics-overview">
        <view class="overview-header">
          <text class="overview-title">健康指标</text>
          <text class="overview-count">{{ healthMetrics.length }}项</text>
        </view>
        
        <view v-if="healthMetrics.length > 0" class="metrics-grid">
          <view 
            v-for="(metric, index) in healthMetrics.slice(0, 4)" 
            :key="index"
            class="metric-item"
            :class="metric.status"
          >
            <view class="metric-icon" :class="metric.status">
              <text class="icon-text">{{ getMetricIcon(metric.name) }}</text>
            </view>
            <view class="metric-info">
              <text class="metric-name">{{ metric.name }}</text>
              <text class="metric-value">{{ metric.value }}{{ metric.unit }}</text>
            </view>
            <view class="metric-status-dot" :class="metric.status"></view>
          </view>
        </view>
        
        <view v-else class="no-data">
          <text class="no-data-text">暂无健康数据</text>
        </view>
      </view>
    </view>

    <!-- 健康趋势图表区域 -->
    <view v-if="healthMetrics.length > 0" class="chart-section">
      <view class="section-header">
        <view class="header-left">
          <text class="header-icon">📊</text>
          <text class="header-title">健康趋势</text>
        </view>
        <view class="header-right">
          <text class="view-more" @click="navigateToTrends">查看详情</text>
        </view>
      </view>
      
      <view class="chart-container">
        <HealthRadarChart
          :healthMetrics="healthMetrics"
          :healthScore="healthScore"
        />
      </view>
    </view>

    <!-- AI健康建议（精简版） -->
    <view v-if="suggestions.length > 0" class="health-suggestions">
      <view class="section-header">
        <view class="header-left">
          <text class="header-icon ai-icon">🤖</text>
          <text class="header-title">AI建议</text>
        </view>
        <view class="ai-badge">智能分析</view>
      </view>
      
      <view class="suggestions-list">
        <view 
          v-for="(suggestion, index) in suggestions.slice(0, 2)" 
          :key="index"
          class="suggestion-item"
        >
          <view class="suggestion-icon" :style="{ background: suggestion.color }">
            {{ suggestion.icon }}
          </view>
          <view class="suggestion-content">
            <view class="suggestion-title">{{ suggestion.title }}</view>
            <view class="suggestion-desc">{{ suggestion.desc }}</view>
          </view>
          <view class="suggestion-action">
            <text class="action-arrow">›</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HealthRadarChart from './HealthRadarChart.vue'
import HealthScoreCard from './HealthScoreCard.vue'
import { evaluateHealthMetric, calculateHealthScore } from '@/config/health-standards.js'
import recordsData from '@/static/mock/records.json'

// 当前日期
const currentDate = ref('')

// 最新病历
const latestRecord = ref(null)

// 健康指标（动态从病历中提取）
const healthMetrics = ref([])

// 健康评分
const healthScore = ref(0)

// 异常指标数量
const abnormalCount = computed(() => {
  return healthMetrics.value.filter(m =>
    m.status === 'high' || m.status === 'low' || m.status === 'danger'
  ).length
})

// AI健康建议
const suggestions = ref([])

// 加载最新病历和指标
const loadLatestMedicalRecord = () => {
  try {
    // 尝试从localStorage获取自定义病历
    const customRecords = uni.getStorageSync('customRecords')
    let allRecords = [...recordsData.records]
    
    if (customRecords) {
      const parsed = JSON.parse(customRecords)
      allRecords = [...parsed, ...allRecords]
    }

    // 按日期排序，获取最新的
    allRecords.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // 获取最新的有lab_results的病历
    const recordWithLab = allRecords.find(r => r.lab_results && r.lab_results.metrics)
    
    if (recordWithLab) {
      latestRecord.value = recordWithLab
      
      // 提取健康指标并评估
      const metrics = recordWithLab.lab_results.metrics.map(metric => {
        const evaluation = evaluateHealthMetric(
          metric.name, 
          metric.value, 
          recordWithLab.lab_results.category
        )
        
        return {
          name: metric.name,
          value: metric.value,
          unit: metric.unit || evaluation.unit,
          ...evaluation
        }
      })
      
      healthMetrics.value = metrics
      
      // 计算健康评分
      healthScore.value = calculateHealthScore(metrics)
      
      // 生成AI建议
      generateSuggestions(metrics, recordWithLab)
    } else {
      // 没有带lab_results的病历，显示最新的普通病历
      if (allRecords.length > 0) {
        latestRecord.value = allRecords[0]
      }
    }
  } catch (e) {
    console.error('加载病历失败', e)
  }
}

// 获取指标图标
const getMetricIcon = (metricName) => {
  const iconMap = {
    '白细胞计数': '🔬',
    '红细胞计数': '🩸',
    '血红蛋白': '🫀',
    '血小板计数': '🩸',
    '总胆固醇': '🧪',
    '甘油三酯': '🧪',
    '谷丙转氨酶': '🫘',
    '谷草转氨酶': '🫘',
    '血糖': '🍯',
    '尿酸': '💧',
    '肌酐': '🫘',
    '尿素氮': '💧'
  }
  return iconMap[metricName] || '📊'
}

// 导航到趋势页面
const navigateToTrends = () => {
  uni.navigateTo({ url: '/pages/trends/trends' })
}

// 生成AI健康建议
const generateSuggestions = (metrics, record) => {
  const newSuggestions = []
  
  // 根据异常指标生成建议
  const abnormalMetrics = metrics.filter(m => 
    m.status === 'high' || m.status === 'low' || m.status === 'danger'
  )
  
  abnormalMetrics.forEach(metric => {
    if (metric.name === '白细胞计数' && metric.status === 'high') {
      newSuggestions.push({
        icon: '!',
        color: 'linear-gradient(135deg, #FFAB40 0%, #FF6F00 100%)',
        title: '关注白细胞异常',
        desc: '白细胞计数偏高，建议多休息，避免感染，必要时复查'
      })
    } else if (metric.name === '总胆固醇' && metric.status === 'high') {
      newSuggestions.push({
        icon: '◆',
        color: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
        title: '控制血脂水平',
        desc: '胆固醇偏高，建议低脂饮食，增加运动，定期复查'
      })
    } else if (metric.name === '谷丙转氨酶' && metric.status === 'high') {
      newSuggestions.push({
        icon: '!',
        color: 'linear-gradient(135deg, #FFAB40 0%, #FF6F00 100%)',
        title: '注意肝脏健康',
        desc: '转氨酶升高，建议戒酒、避免熬夜，清淡饮食'
      })
    } else if (metric.status === 'danger') {
      newSuggestions.push({
        icon: '!',
        color: 'linear-gradient(135deg, #FF5252 0%, #E91E63 100%)',
        title: `${metric.name}严重异常`,
        desc: '建议尽快就医咨询，进行专业治疗'
      })
    }
  })
  
  // 添加通用建议
  if (record.prescription_id) {
    newSuggestions.push({
      icon: '+',
      color: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      title: '按时服药',
      desc: '根据医嘱按时服药，不可随意停药或调整剂量'
    })
  }
  
  if (abnormalMetrics.length > 0) {
    newSuggestions.push({
      icon: '◆',
      color: 'linear-gradient(135deg, #81FBB8 0%, #28C76F 100%)',
      title: '健康生活方式',
      desc: '保持规律作息，均衡饮食，适量运动，定期体检'
    })
  }
  
  // 如果所有指标正常
  if (abnormalMetrics.length === 0) {
    newSuggestions.push({
      icon: '◆',
      color: 'linear-gradient(135deg, #37CD87 0%, #2DB873 100%)',
      title: '健康状况良好',
      desc: '各项指标正常，继续保持健康的生活方式'
    })
    newSuggestions.push({
      icon: '◎',
      color: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
      title: '定期体检',
      desc: '建议每年进行一次全面体检，及早发现潜在问题'
    })
  }
  
  suggestions.value = newSuggestions.slice(0, 4) // 最多显示4条建议
}


onMounted(() => {
  // 获取当前日期
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  currentDate.value = `${year}/${month}/${day}`
  
  // 加载病历数据
  loadLatestMedicalRecord()
})
</script>

<style lang="scss" scoped>
.health-dashboard {
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

// 主仪表盘区域
.dashboard-main {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  
  .score-card-section {
    flex: 1;
    min-width: 0;
  }
  
  .metrics-overview {
    flex: 1.2;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20rpx;
    padding: 24rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(10rpx);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .overview-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #2c3e50;
      }
      
      .overview-count {
        font-size: 24rpx;
        color: #7f8c8d;
        background: rgba(52, 152, 219, 0.1);
        padding: 8rpx 16rpx;
        border-radius: 20rpx;
      }
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16rpx;
      
      .metric-item {
        display: flex;
        align-items: center;
        padding: 16rpx;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 16rpx;
        border: 1px solid rgba(0, 0, 0, 0.05);
        position: relative;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2rpx);
          box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
        }
        
        .metric-icon {
          width: 48rpx;
          height: 48rpx;
          border-radius: 12rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12rpx;
          font-size: 20rpx;
          
          &.normal {
            background: linear-gradient(135deg, #81FBB8 0%, #28C76F 100%);
          }
          
          &.high, &.low {
            background: linear-gradient(135deg, #FFAB40 0%, #FF6F00 100%);
          }
          
          &.danger {
            background: linear-gradient(135deg, #FF5252 0%, #E91E63 100%);
          }
          
          .icon-text {
            color: white;
            font-size: 24rpx;
          }
        }
        
        .metric-info {
          flex: 1;
          min-width: 0;
          
          .metric-name {
            display: block;
            font-size: 24rpx;
            color: #2c3e50;
            font-weight: 500;
            margin-bottom: 4rpx;
          }
          
          .metric-value {
            display: block;
            font-size: 20rpx;
            color: #7f8c8d;
          }
        }
        
        .metric-status-dot {
          width: 12rpx;
          height: 12rpx;
          border-radius: 50%;
          position: absolute;
          top: 12rpx;
          right: 12rpx;
          
          &.normal {
            background: #28C76F;
          }
          
          &.high, &.low {
            background: #FF6F00;
          }
          
          &.danger {
            background: #E91E63;
            animation: pulse 2s infinite;
          }
        }
      }
    }
    
    .no-data {
      text-align: center;
      padding: 60rpx 20rpx;
      
      .no-data-text {
        color: #95a5a6;
        font-size: 28rpx;
      }
    }
  }
}

// 图表区域
.chart-section {
  margin: 20rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .chart-container {
    margin-top: 20rpx;
  }
}

// 通用区块头部
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 12rpx;
    
    .header-icon {
      font-size: 32rpx;
      
      &.ai-icon {
        background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: glow-pulse 2s ease-in-out infinite alternate;
      }
    }
    
    .header-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #2c3e50;
    }
  }
  
  .header-right {
    .view-more {
      font-size: 24rpx;
      color: #3498db;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      background: rgba(52, 152, 219, 0.1);
      transition: all 0.3s ease;
      
      &:active {
        background: rgba(52, 152, 219, 0.2);
        transform: scale(0.95);
      }
    }
  }
  
  .ai-badge {
    font-size: 20rpx;
    color: #667EEA;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    border: 1px solid rgba(102, 126, 234, 0.2);
  }
}

// AI建议区域
.health-suggestions {
  margin: 20rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10rpx);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .suggestions-list {
    .suggestion-item {
      display: flex;
      align-items: center;
      padding: 20rpx;
      margin-bottom: 16rpx;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 16rpx;
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      &:active {
        transform: scale(0.98);
        background: rgba(255, 255, 255, 0.9);
      }
      
      .suggestion-icon {
        width: 48rpx;
        height: 48rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16rpx;
        color: white;
        font-weight: bold;
        font-size: 24rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
      }
      
      .suggestion-content {
        flex: 1;
        min-width: 0;
        
        .suggestion-title {
          display: block;
          font-size: 28rpx;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8rpx;
        }
        
        .suggestion-desc {
          display: block;
          font-size: 24rpx;
          color: #7f8c8d;
          line-height: 1.4;
        }
      }
      
      .suggestion-action {
        .action-arrow {
          font-size: 32rpx;
          color: #bdc3c7;
          transition: all 0.3s ease;
        }
      }
      
      &:active .action-arrow {
        color: #3498db;
        transform: translateX(4rpx);
      }
    }
  }
}

// 动画效果
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes glow-pulse {
  0% {
    filter: brightness(1);
  }
  100% {
    filter: brightness(1.2);
  }
}

// 响应式适配
@media (max-width: 750rpx) {
  .dashboard-main {
    flex-direction: column;
    
    .metrics-overview .metrics-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
