<template>
  <view class="onboarding-container">
    <swiper class="swiper" :current="current" @change="onSwiperChange" duration="400">
      <swiper-item v-for="(slide, index) in slides" :key="index">
        <view class="slide">
          <!-- CSS Illustration -->
          <view :class="['illustration', 'illust-' + (index + 1)]">
            <view v-if="index === 0" class="illust-phone">
              <view class="phone-body">
                <view class="phone-screen">
                  <view class="screen-line sl-1"></view>
                  <view class="screen-line sl-2"></view>
                  <view class="screen-circle"></view>
                  <view class="screen-line sl-3"></view>
                </view>
              </view>
              <view class="phone-pulse p1"></view>
              <view class="phone-pulse p2"></view>
            </view>
            <view v-else-if="index === 1" class="illust-doc">
              <view class="doc-card">
                <view class="doc-header-bar"></view>
                <view class="doc-line dl-1"></view>
                <view class="doc-line dl-2"></view>
                <view class="doc-line dl-3"></view>
                <view class="doc-tag-row">
                  <view class="doc-tag"></view>
                  <view class="doc-tag dt2"></view>
                </view>
              </view>
              <view class="doc-check-circle">
                <view class="check-stem"></view>
                <view class="check-arc"></view>
              </view>
            </view>
            <view v-else class="illust-consult">
              <view class="consult-person"></view>
              <view class="consult-line cl-1"></view>
              <view class="consult-line cl-2"></view>
              <view class="consult-bubble">
                <view class="bubble-dot bd1"></view>
                <view class="bubble-dot bd2"></view>
                <view class="bubble-dot bd3"></view>
              </view>
            </view>
          </view>
          <text class="slide-title">{{ slide.title }}</text>
          <text class="slide-desc">{{ slide.desc }}</text>
        </view>
      </swiper-item>
    </swiper>

    <view class="footer">
      <view class="indicators">
        <view
          v-for="(_, i) in slides"
          :key="i"
          class="indicator"
          :class="{ active: i === current }"
        ></view>
      </view>
      <view class="actions">
        <text v-if="current < slides.length - 1" class="skip-btn" @click="skip">跳过</text>
        <view v-else class="start-btn" @click="start">
          <text class="start-btn-text">立即开始</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(0)

const slides = [
  { title: '智能健康管理', desc: 'AI驱动的健康分析，随时掌握您的健康状况' },
  { title: '病历智能管理', desc: '上传检查报告，AI自动分析并生成详细报告' },
  { title: '在线问诊咨询', desc: '与专业医生在线沟通，足不出户享受医疗服务' }
]

function onSwiperChange(e) {
  current.value = e.detail.current
}

function skip() {
  uni.setStorageSync('healthcare_onboarding_done', true)
  uni.reLaunch({ url: '/pages/login/login' })
}

function start() {
  uni.setStorageSync('healthcare_onboarding_done', true)
  uni.reLaunch({ url: '/pages/login/login' })
}
</script>

<style scoped lang="scss">
.onboarding-container {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.swiper {
  flex: 1;
}

.slide {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 80rpx;
  box-sizing: border-box;
}

/* ========== Illustrations ========== */
.illustration {
  width: 320rpx;
  height: 320rpx;
  margin-bottom: 80rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* --- Page 1: Phone with health data --- */
.illust-phone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.phone-body {
  width: 180rpx;
  height: 300rpx;
  background: #fff;
  border-radius: 30rpx;
  border: 6rpx solid #37CD87;
  box-shadow: 0 16rpx 48rpx rgba(55, 205, 135, 0.2);
  padding: 30rpx 20rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.phone-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding-top: 20rpx;
}
.screen-line {
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
}
.sl-1 { width: 100%; }
.sl-2 { width: 70%; background: #e8f8ef; }
.screen-circle {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #37CD87, #2DB873);
  margin: 10rpx auto;
  position: relative;
}
.screen-circle::after {
  content: '+';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 40rpx;
  font-weight: 700;
}
.sl-3 { width: 85%; }
.phone-pulse {
  position: absolute;
  width: 180rpx;
  height: 300rpx;
  border-radius: 30rpx;
  border: 2rpx solid rgba(55, 205, 135, 0.3);
  top: 0;
  left: 0;
  animation: phonePulse 2s ease-out infinite;
}
.p2 { animation-delay: 1s; }
@keyframes phonePulse {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.2); opacity: 0; }
}

/* --- Page 2: Document with checkmark --- */
.illust-doc {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.doc-card {
  width: 220rpx;
  height: 280rpx;
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.08);
  padding: 28rpx 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.doc-header-bar {
  width: 80rpx;
  height: 16rpx;
  background: #37CD87;
  border-radius: 8rpx;
}
.doc-line {
  height: 10rpx;
  background: #f0f0f0;
  border-radius: 5rpx;
}
.dl-1 { width: 100%; }
.dl-2 { width: 80%; }
.dl-3 { width: 60%; }
.doc-tag-row {
  display: flex;
  gap: 12rpx;
  margin-top: 8rpx;
}
.doc-tag {
  width: 48rpx;
  height: 24rpx;
  background: #e8f8ef;
  border-radius: 12rpx;
}
.doc-tag.dt2 { width: 60rpx; background: #fff4e6; }
.doc-check-circle {
  position: absolute;
  bottom: -10rpx;
  right: -10rpx;
  width: 64rpx;
  height: 64rpx;
  background: linear-gradient(135deg, #37CD87, #2DB873);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(55, 205, 135, 0.3);
}
.check-stem {
  width: 8rpx;
  height: 20rpx;
  background: #fff;
  border-radius: 4rpx;
  position: absolute;
  bottom: 24rpx;
  left: 28rpx;
  transform: rotate(-45deg);
}
.check-arc {
  width: 8rpx;
  height: 12rpx;
  background: #fff;
  border-radius: 4rpx;
  position: absolute;
  bottom: 28rpx;
  left: 32rpx;
  transform: rotate(45deg);
}

/* --- Page 3: Consultation --- */
.illust-consult {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.consult-person {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #37CD87, #2DB873);
  position: relative;
}
.consult-person::after {
  content: '';
  position: absolute;
  bottom: -36rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 48rpx;
  background: linear-gradient(135deg, #37CD87, #2DB873);
  border-radius: 48rpx 48rpx 0 0;
}
.consult-line {
  position: absolute;
  height: 6rpx;
  background: #e8f8ef;
  border-radius: 3rpx;
}
.cl-1 { width: 120rpx; top: 20rpx; right: -80rpx; }
.cl-2 { width: 80rpx; top: 44rpx; right: -40rpx; }
.consult-bubble {
  position: absolute;
  top: -20rpx;
  right: -120rpx;
  width: 100rpx;
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 20rpx 20rpx 20rpx 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 0 16rpx;
}
.bubble-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #37CD87;
}
.bd2 { animation: bubbleDot 1.2s ease-in-out infinite; }
.bd3 { animation: bubbleDot 1.2s ease-in-out 0.4s infinite; }
@keyframes bubbleDot {
  0%, 80%, 100% { opacity: 0.4; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

/* ========== Text ========== */
.slide-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24rpx;
  text-align: center;
  letter-spacing: 2rpx;
}

.slide-desc {
  font-size: 28rpx;
  color: #8C8C8C;
  text-align: center;
  line-height: 1.8;
  letter-spacing: 1rpx;
}

/* ========== Footer ========== */
.footer {
  padding: 40rpx 60rpx 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48rpx;
}

.indicators {
  display: flex;
  gap: 16rpx;
}

.indicator {
  width: 12rpx;
  height: 12rpx;
  border-radius: 6rpx;
  background: #e0e0e0;
  transition: all 0.3s ease;
}

.indicator.active {
  width: 40rpx;
  background: #37CD87;
}

.actions {
  width: 100%;
  display: flex;
  justify-content: center;
}

.skip-btn {
  font-size: 30rpx;
  color: #8C8C8C;
  padding: 20rpx 60rpx;
  letter-spacing: 2rpx;
}

.start-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(55, 205, 135, 0.3);
}

.start-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 4rpx;
}
</style>
