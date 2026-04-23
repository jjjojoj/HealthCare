<template>
  <view class="page">
    <AppHeader title="BMI 健康评估" :show-back="true" />

    <scroll-view scroll-y class="content">
      <!-- 输入区域 -->
      <view class="input-card">
        <view class="input-row">
          <view class="input-group">
            <text class="input-label">身高</text>
            <view class="input-box">
              <input class="input-field" type="number" v-model="height" placeholder="170" />
              <text class="input-unit">cm</text>
            </view>
          </view>
          <view class="input-group">
            <text class="input-label">体重</text>
            <view class="input-box">
              <input class="input-field" type="number" v-model="weight" placeholder="65" />
              <text class="input-unit">kg</text>
            </view>
          </view>
        </view>
        <view class="calc-btn" @click="calculate">
          <text class="calc-btn-text">开始评估</text>
        </view>
      </view>

      <!-- 结果区域 -->
      <view class="result-area" v-if="result">
        <!-- BMI 圆环 -->
        <view class="bmi-circle-card">
          <view class="bmi-ring" :style="{ borderColor: ringColor }">
            <view class="bmi-value-wrap">
              <text class="bmi-number" :style="{ color: ringColor }">{{ result.bmi }}</text>
              <text class="bmi-label">BMI</text>
            </view>
          </view>
          <view class="bmi-category" :style="{ color: ringColor }">
            <text class="category-text">{{ result.category }}</text>
          </view>
        </view>

        <!-- 范围条 -->
        <view class="range-card">
          <text class="range-title">BMI 范围参考</text>
          <view class="range-bar">
            <view class="range-seg seg-thin">
              <text class="seg-label">偏瘦</text>
              <text class="seg-value">&lt;18.5</text>
            </view>
            <view class="range-seg seg-normal">
              <text class="seg-label">正常</text>
              <text class="seg-value">18.5-24</text>
            </view>
            <view class="range-seg seg-fat">
              <text class="seg-label">偏胖</text>
              <text class="seg-value">24-28</text>
            </view>
            <view class="range-seg seg-obese">
              <text class="seg-label">肥胖</text>
              <text class="seg-value">&gt;28</text>
            </view>
            <view class="range-marker" :style="{ left: markerPosition + '%' }"></view>
          </view>
        </view>

        <!-- 健康建议 -->
        <view class="advice-card">
          <text class="advice-title">健康建议</text>
          <view class="advice-list">
            <view class="advice-item" v-for="(item, index) in result.advice" :key="index">
              <view class="advice-dot"></view>
              <text class="advice-text">{{ item }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const height = ref('')
const weight = ref('')
const result = ref(null)

const ringColor = computed(() => {
  if (!result.value) return '#37CD87'
  const cat = result.value.categoryKey
  if (cat === 'thin') return '#1890FF'
  if (cat === 'normal') return '#37CD87'
  if (cat === 'overweight') return '#FA8C16'
  return '#F5222D'
})

const markerPosition = computed(() => {
  if (!result.value) return 50
  const bmi = result.value.bmi
  const clamped = Math.max(14, Math.min(36, bmi))
  return ((clamped - 14) / (36 - 14)) * 100
})

function calculate() {
  const h = parseFloat(height.value)
  const w = parseFloat(weight.value)
  if (!h || !w || h <= 0 || w <= 0) {
    uni.showToast({ title: '请输入有效的身高体重', icon: 'none' })
    return
  }
  const bmi = (w / ((h / 100) ** 2)).toFixed(1)
  const bmiNum = parseFloat(bmi)

  let category, categoryKey, advice
  if (bmiNum < 18.5) {
    category = '偏瘦'
    categoryKey = 'thin'
    advice = [
      '建议适当增加热量摄入，保证营养均衡',
      '多食用富含蛋白质的食物，如鸡蛋、牛奶、瘦肉',
      '配合力量训练，增加肌肉量',
      '保证充足的睡眠和规律作息'
    ]
  } else if (bmiNum < 24) {
    category = '正常'
    categoryKey = 'normal'
    advice = [
      '您的体重处于健康范围，请继续保持',
      '每周保持 150 分钟以上中等强度运动',
      '注意饮食多样化，控制高油高糖食物摄入',
      '定期体检，关注身体各项指标变化'
    ]
  } else if (bmiNum < 28) {
    category = '偏胖'
    categoryKey = 'overweight'
    advice = [
      '建议适当控制饮食，减少高热量食物摄入',
      '增加有氧运动频率，每周至少 5 次',
      '少食多餐，避免暴饮暴食',
      '建议咨询营养师，制定个性化饮食方案'
    ]
  } else {
    category = '肥胖'
    categoryKey = 'obese'
    advice = [
      '建议尽快就医咨询，评估健康风险',
      '严格控制饮食，在专业指导下减重',
      '从低强度运动开始，逐步增加运动量',
      '关注血压、血糖、血脂等指标'
    ]
  }

  result.value = { bmi, category, categoryKey, advice }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.content {
  padding: 24rpx 32rpx;
}

.input-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.input-row {
  display: flex;
  gap: 32rpx;
  margin-bottom: 32rpx;
}

.input-group {
  flex: 1;
}

.input-label {
  font-size: 26rpx;
  color: #8C8C8C;
  margin-bottom: 12rpx;
  display: block;
}

.input-box {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  height: 80rpx;
}

.input-field {
  flex: 1;
  font-size: 32rpx;
  color: #262626;
  font-weight: 600;
}

.input-unit {
  font-size: 26rpx;
  color: #8C8C8C;
  margin-left: 8rpx;
}

.calc-btn {
  height: 88rpx;
  background: linear-gradient(135deg, #37CD87, #2DB873);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calc-btn-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
  letter-spacing: 4rpx;
}

/* 结果区域 */
.result-area {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.bmi-circle-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 48rpx 32rpx 36rpx;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bmi-ring {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  border: 8rpx solid #37CD87;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.bmi-value-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bmi-number {
  font-size: 64rpx;
  font-weight: 700;
  line-height: 1;
}

.bmi-label {
  font-size: 24rpx;
  color: #8C8C8C;
  margin-top: 4rpx;
}

.bmi-category {
  padding: 8rpx 40rpx;
  border-radius: 24rpx;
  background: #F5F5F5;
}

.category-text {
  font-size: 28rpx;
  font-weight: 600;
}

/* 范围条 */
.range-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.range-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 24rpx;
  display: block;
}

.range-bar {
  display: flex;
  height: 72rpx;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
}

.range-seg {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}

.seg-thin { background: #E6F7FF; }
.seg-normal { background: #E8F8EF; }
.seg-fat { background: #FFF7E6; }
.seg-obese { background: #FFF1F0; }

.seg-label {
  font-size: 22rpx;
  color: #595959;
  font-weight: 500;
}

.seg-value {
  font-size: 18rpx;
  color: #8C8C8C;
}

.range-marker {
  position: absolute;
  top: 0;
  width: 4rpx;
  height: 100%;
  background: #262626;
  transform: translateX(-2rpx);
  border-radius: 2rpx;
  transition: left 0.6s ease;
}

.range-marker::after {
  content: '';
  position: absolute;
  top: -6rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 16rpx;
  height: 16rpx;
  background: #262626;
  border-radius: 50%;
}

/* 建议 */
.advice-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.advice-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 20rpx;
  display: block;
}

.advice-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.advice-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.advice-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #37CD87;
  margin-top: 12rpx;
  flex-shrink: 0;
}

.advice-text {
  font-size: 26rpx;
  color: #595959;
  line-height: 1.6;
}
</style>
