<template>
  <view class="health-metric-bar" :class="{ compact }" @click="showDetail">
    <!-- 指标头部 -->
    <view class="metric-header">
      <view class="metric-icon-wrapper">
        <view class="metric-icon" :style="{ background: metric.gradient }">
          {{ metric.icon }}
        </view>
      </view>
      <view class="metric-info">
        <view class="metric-name">{{ metric.name }}</view>
        <view class="metric-value-line">
          <text class="metric-value">{{ metric.value }}</text>
          <text class="metric-unit" v-if="metric.unit">{{ metric.unit }}</text>
        </view>
      </view>
      <view class="metric-status" :class="metric.status">
        {{ metric.statusText }}
      </view>
    </view>

    <!-- 进度条 -->
    <view class="progress-container">
      <view class="progress-track">
        <!-- 正常范围标记 -->
        <view class="normal-range-marker" :style="normalRangeStyle"></view>
        
        <!-- 进度条 -->
        <view 
          class="progress-bar" 
          :class="metric.status"
          :style="{ width: metric.progress + '%', background: getProgressColor }"
        >
          <view class="progress-shine"></view>
        </view>
        
        <!-- 当前值指示器 -->
        <view class="value-indicator" :style="{ left: metric.progress + '%' }">
          <view class="indicator-dot" :style="{ background: metric.statusColor }"></view>
        </view>
      </view>
      
      <!-- 参考范围标签（紧凑模式隐藏） -->
      <view class="range-labels" v-if="!compact && showRange">
        <text class="range-label min">{{ metric.min }}</text>
        <text class="range-label optimal">最优</text>
        <text class="range-label max">{{ metric.max }}</text>
      </view>
    </view>

    <!-- 详细说明（紧凑模式隐藏） -->
    <view class="metric-desc" v-if="!compact && showDescription">
      <text class="desc-text">{{ getDescription }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  metric: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  },
  showRange: {
    type: Boolean,
    default: true
  },
  showDescription: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['detail'])

// 计算正常范围的样式
const normalRangeStyle = computed(() => {
  if (!props.metric.min || !props.metric.max) return {}
  
  // 假设整个进度条代表从最小值的50%到最大值的150%
  const totalMin = props.metric.min * 0.5
  const totalMax = props.metric.max * 1.5
  const totalRange = totalMax - totalMin
  
  const normalMin = props.metric.min
  const normalMax = props.metric.max
  
  const startPercent = ((normalMin - totalMin) / totalRange) * 100
  const widthPercent = ((normalMax - normalMin) / totalRange) * 100
  
  return {
    left: startPercent + '%',
    width: widthPercent + '%'
  }
})

// 进度条颜色
const getProgressColor = computed(() => {
  const status = props.metric.status
  
  if (status === 'normal') {
    return 'linear-gradient(90deg, #37CD87 0%, #2DB873 100%)'
  } else if (status === 'low') {
    return 'linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)'
  } else if (status === 'high') {
    return 'linear-gradient(90deg, #FFAB40 0%, #FF6F00 100%)'
  } else if (status === 'danger') {
    return 'linear-gradient(90deg, #FF5252 0%, #E91E63 100%)'
  } else {
    return 'linear-gradient(90deg, #E0E0E0 0%, #BDBDBD 100%)'
  }
})

// 获取描述文本
const getDescription = computed(() => {
  const { status, name, value, min, max } = props.metric
  
  if (status === 'normal') {
    return `${name}在正常范围内（${min}-${max}），请继续保持`
  } else if (status === 'low') {
    return `${name}偏低，当前值${value}，正常范围${min}-${max}`
  } else if (status === 'high') {
    return `${name}偏高，当前值${value}，正常范围${min}-${max}`
  } else if (status === 'danger') {
    if (value > max) {
      return `${name}严重偏高，建议及时就医`
    } else {
      return `${name}严重偏低，建议及时就医`
    }
  } else {
    return `${name}数据待评估`
  }
})

// 显示详情
const showDetail = () => {
  emit('detail', props.metric)
}
</script>

<style scoped lang="scss">
.health-metric-bar {
  background: white;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  
  /* 紧凑模式样式 */
  &.compact {
    padding: 16rpx;
    margin-bottom: 0;
    box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.04);
    
    .metric-header {
      margin-bottom: 12rpx;
    }
    
    .metric-icon {
      width: 48rpx;
      height: 48rpx;
      font-size: 24rpx;
      border-radius: 12rpx;
    }
    
    .metric-name {
      font-size: 24rpx;
      margin-bottom: 2rpx;
    }
    
    .metric-value {
      font-size: 28rpx;
    }
    
    .metric-unit {
      font-size: 20rpx;
    }
    
    .metric-status {
      font-size: 20rpx;
      padding: 4rpx 10rpx;
    }
    
    .progress-track {
      height: 14rpx;
      margin: 8rpx 0;
    }
    
    .value-indicator {
      width: 16rpx;
      height: 16rpx;
      
      .indicator-dot {
        width: 10rpx;
        height: 10rpx;
      }
    }
  }
}

.health-metric-bar:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

/* 指标头部 */
.metric-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.metric-icon-wrapper {
  margin-right: 16rpx;
}

.metric-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
}

.metric-info {
  flex: 1;
}

.metric-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 6rpx;
}

.metric-value-line {
  display: flex;
  align-items: baseline;
}

.metric-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #1A202C;
}

.metric-unit {
  font-size: 22rpx;
  color: #718096;
  margin-left: 6rpx;
  font-weight: 500;
}

.metric-status {
  font-size: 22rpx;
  font-weight: 600;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.metric-status.normal {
  background: rgba(55, 205, 135, 0.15);
  color: #37CD87;
}

.metric-status.low {
  background: rgba(79, 172, 254, 0.15);
  color: #4FACFE;
}

.metric-status.high {
  background: rgba(255, 171, 64, 0.15);
  color: #FFAB40;
}

.metric-status.danger {
  background: rgba(255, 82, 82, 0.15);
  color: #FF5252;
}

.metric-status.unknown {
  background: rgba(158, 158, 158, 0.15);
  color: #9E9E9E;
}

/* 进度条容器 */
.progress-container {
  margin-bottom: 16rpx;
}

.progress-track {
  height: 20rpx;
  background: #F5F7FA;
  border-radius: 10rpx;
  position: relative;
  overflow: visible;
  margin: 16rpx 0;
}

/* 正常范围标记 */
.normal-range-marker {
  position: absolute;
  top: 0;
  height: 100%;
  background: rgba(55, 205, 135, 0.12);
  border-left: 2rpx dashed rgba(55, 205, 135, 0.4);
  border-right: 2rpx dashed rgba(55, 205, 135, 0.4);
  border-radius: 10rpx;
  z-index: 0;
}

/* 进度条 */
.progress-bar {
  height: 100%;
  border-radius: 10rpx;
  position: relative;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.progress-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shine 2s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

/* 当前值指示器 */
.value-indicator {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.indicator-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: #37CD87;
  border: 4rpx solid white;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  }
  50% {
    transform: scale(1.2);
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.25);
  }
}

/* 参考范围标签 */
.range-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
  padding: 0 4rpx;
}

.range-label {
  font-size: 20rpx;
  color: #A0AEC0;
  font-weight: 500;
}

.range-label.optimal {
  color: #37CD87;
  font-weight: 600;
}

/* 详细说明 */
.metric-desc {
  background: #F8FAFC;
  border-radius: 12rpx;
  padding: 16rpx;
  border-left: 4rpx solid #E2E8F0;
}

.desc-text {
  font-size: 24rpx;
  color: #4A5568;
  line-height: 1.6;
}
</style>

