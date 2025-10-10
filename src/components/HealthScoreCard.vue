<template>
  <view class="health-score-card">
    <!-- 圆形进度环 -->
    <view class="score-ring">
      <canvas
        class="score-canvas"
        canvas-id="scoreCanvas"
        :id="canvasId"
      ></canvas>

      <!-- 中心内容 -->
      <view class="score-center">
        <view class="score-value">{{ score }}</view>
        <view class="score-label">综合评分</view>
      </view>
    </view>

    <!-- 评分等级 -->
    <view class="score-grade" :class="gradeClass">
      <view class="grade-icon">{{ gradeIcon }}</view>
      <view class="grade-text">{{ gradeText }}</view>
    </view>

    <!-- 健康指标 -->
    <view class="health-indicators">
      <view
        v-for="(indicator, index) in indicators"
        :key="index"
        class="indicator-item"
      >
        <view class="indicator-dot" :style="{ background: indicator.color }"></view>
        <view class="indicator-name">{{ indicator.name }}</view>
        <view class="indicator-status" :style="{ color: indicator.color }">
          {{ indicator.status }}
        </view>
      </view>
    </view>

    <!-- 趋势提示 -->
    <view class="trend-tip">
      <view class="trend-icon" :class="trendClass">{{ trendIcon }}</view>
      <text class="trend-text">{{ trendText }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    default: 85
  },
  canvasId: {
    type: String,
    default: 'scoreCanvas'
  }
})

// 健康指标数据
const indicators = ref([
  { name: '心率', status: '正常', color: '#52c41a' },
  { name: '血压', status: '正常', color: '#52c41a' },
  { name: '血糖', status: '良好', color: '#1890ff' },
  { name: 'BMI', status: '标准', color: '#52c41a' }
])

// 评分等级
const gradeClass = computed(() => {
  if (props.score >= 90) return 'grade-excellent'
  if (props.score >= 80) return 'grade-good'
  if (props.score >= 70) return 'grade-normal'
  return 'grade-warning'
})

const gradeIcon = computed(() => {
  if (props.score >= 90) return '⭐'
  if (props.score >= 80) return '😊'
  if (props.score >= 70) return '😐'
  return '⚠️'
})

const gradeText = computed(() => {
  if (props.score >= 90) return '优秀'
  if (props.score >= 80) return '良好'
  if (props.score >= 70) return '一般'
  return '需改善'
})

// 趋势
const trendClass = ref('trend-up')
const trendIcon = ref('↑')
const trendText = ref('较上周提升 3 分')

// 绘制圆形进度环
const drawScoreRing = () => {
  const ctx = uni.createCanvasContext(props.canvasId)
  const centerX = 75
  const centerY = 75
  const radius = 60
  const lineWidth = 12

  // 背景圆环
  ctx.setLineWidth(lineWidth)
  ctx.setStrokeStyle('#f0f0f0')
  ctx.setLineCap('round')
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.stroke()

  // 渐变色进度环
  const gradient = ctx.createLinearGradient(0, 0, 150, 150)
  gradient.addColorStop(0, '#37CD87')
  gradient.addColorStop(0.5, '#2DB873')
  gradient.addColorStop(1, '#25A563')

  ctx.setLineWidth(lineWidth)
  ctx.setStrokeStyle(gradient)
  ctx.setLineCap('round')

  // 动画绘制进度环
  let currentPercent = 0
  const targetPercent = props.score / 100
  const animationDuration = 1000 // 1秒
  const frameRate = 60
  const totalFrames = (animationDuration / 1000) * frameRate
  const increment = targetPercent / totalFrames

  const animate = () => {
    if (currentPercent < targetPercent) {
      currentPercent += increment
      if (currentPercent > targetPercent) {
        currentPercent = targetPercent
      }

      // 清除画布
      ctx.clearRect(0, 0, 150, 150)

      // 重绘背景圆环
      ctx.setLineWidth(lineWidth)
      ctx.setStrokeStyle('#f0f0f0')
      ctx.setLineCap('round')
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.stroke()

      // 绘制进度环
      const endAngle = -Math.PI / 2 + (2 * Math.PI * currentPercent)
      ctx.setLineWidth(lineWidth)
      ctx.setStrokeStyle(gradient)
      ctx.setLineCap('round')
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle)
      ctx.stroke()

      // 添加光晕效果
      ctx.setShadow(0, 0, 10, 'rgba(37, 165, 99, 0.3)')
      ctx.stroke()

      ctx.draw()

      requestAnimationFrame(animate)
    } else {
      // 最终绘制
      ctx.draw()
    }
  }

  animate()
}

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      drawScoreRing()
    }, 100)
  })
})
</script>

<style scoped lang="scss">
.health-score-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fff8 100%);
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(55, 205, 135, 0.12);
  border: 2rpx solid rgba(55, 205, 135, 0.15);
  position: relative;
  overflow: hidden;
}

// 装饰性背景
.health-score-card::before {
  content: '';
  position: absolute;
  top: -50rpx;
  right: -50rpx;
  width: 200rpx;
  height: 200rpx;
  background: radial-gradient(circle, rgba(55, 205, 135, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}

// 圆形进度环
.score-ring {
  position: relative;
  width: 300rpx;
  height: 300rpx;
  margin: 0 auto 24rpx;
}

.score-canvas {
  width: 300rpx;
  height: 300rpx;
}

.score-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-value {
  font-size: 72rpx;
  font-weight: 700;
  background: linear-gradient(135deg, #37CD87 0%, #25A563 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 8rpx;
}

.score-label {
  font-size: 24rpx;
  color: #8c8c8c;
  font-weight: 500;
}

// 评分等级
.score-grade {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 16rpx 24rpx;
  border-radius: 16rpx;
  margin-bottom: 24rpx;

  &.grade-excellent {
    background: linear-gradient(135deg, #fff7e6 0%, #fffbf0 100%);
    border: 2rpx solid #ffd591;
  }

  &.grade-good {
    background: linear-gradient(135deg, #e6fffb 0%, #f0ffff 100%);
    border: 2rpx solid #87e8de;
  }

  &.grade-normal {
    background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
    border: 2rpx solid #91d5ff;
  }

  &.grade-warning {
    background: linear-gradient(135deg, #fff1f0 0%, #fff5f5 100%);
    border: 2rpx solid #ffccc7;
  }
}

.grade-icon {
  font-size: 32rpx;
}

.grade-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
}

// 健康指标
.health-indicators {
  margin-bottom: 24rpx;
}

.indicator-item {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  gap: 16rpx;
}

.indicator-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 8rpx currentColor;
}

.indicator-name {
  font-size: 26rpx;
  color: #595959;
  flex: 1;
}

.indicator-status {
  font-size: 24rpx;
  font-weight: 500;
}

// 趋势提示
.trend-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 12rpx;
  background: rgba(55, 205, 135, 0.08);
  border-radius: 12rpx;
}

.trend-icon {
  font-size: 24rpx;
  font-weight: 700;

  &.trend-up {
    color: #52c41a;
  }

  &.trend-down {
    color: #ff4d4f;
  }
}

.trend-text {
  font-size: 24rpx;
  color: #595959;
}
</style>
