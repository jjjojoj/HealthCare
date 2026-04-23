<template>
  <view class="splash">
    <view class="center-content">
      <view class="icon-circle">
        <view class="cross-h"></view>
        <view class="cross-v"></view>
      </view>
      <view class="app-name">健康管理中心</view>
      <view class="app-subtitle">Healthcare Management Center</view>
    </view>
    <view class="loading-dots">
      <view class="dot dot1"></view>
      <view class="dot dot2"></view>
      <view class="dot dot3"></view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { useAuth } from '@/composables/useAuth'

const { getLaunchUrl } = useAuth()

onLoad(() => {
  setTimeout(() => {
    const targetUrl = getLaunchUrl()
    uni.reLaunch({ url: targetUrl })
  }, 1500)
})
</script>

<style scoped>
.splash {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(160deg, #37CD87 0%, #2DB873 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-circle {
  width: 160rpx;
  height: 160rpx;
  background: #fff;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 48rpx;
}

.cross-h,
.cross-v {
  position: absolute;
  background: #2DB873;
  border-radius: 4rpx;
}

.cross-h {
  width: 72rpx;
  height: 20rpx;
}

.cross-v {
  width: 20rpx;
  height: 72rpx;
}

.app-name {
  color: #fff;
  font-size: 40rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
  margin-bottom: 16rpx;
}

.app-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 24rpx;
  letter-spacing: 1rpx;
}

.loading-dots {
  position: absolute;
  bottom: 120rpx;
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: pulse 1.2s ease-in-out infinite;
}

.dot2 { animation-delay: 0.2s; }
.dot3 { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
</style>
