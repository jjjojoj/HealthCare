<template>
  <view class="page">
    <AppHeader title="首页" />

    <view class="content">
      <view class="welcome-card">
        <view class="welcome-text">欢迎，{{ userName }}</view>
        <view class="welcome-subtitle">远程医疗管理系统</view>
      </view>

      <view class="grid">
        <view class="grid-item" @click="navigateTo('/pages/records/list')">
          <view class="grid-icon">📋</view>
          <view class="grid-text">病历列表</view>
        </view>
        <view class="grid-item" @click="navigateTo('/pages/upload/upload')">
          <view class="grid-icon">📤</view>
          <view class="grid-text">上传文件</view>
        </view>
        <view class="grid-item" @click="navigateTo('/pages/chatbot/chat')">
          <view class="grid-icon">💬</view>
          <view class="grid-text">智能咨询</view>
        </view>
        <view class="grid-item" @click="navigateTo('/pages/trends/trends')">
          <view class="grid-icon">📊</view>
          <view class="grid-text">健康趋势</view>
        </view>
        <view class="grid-item" @click="navigateTo('/pages/meds/meds')">
          <view class="grid-icon">💊</view>
          <view class="grid-text">用药助手</view>
        </view>
        <view class="grid-item" @click="navigateTo('/pages/emergency/emergency')">
          <view class="grid-icon">🚨</view>
          <view class="grid-text">紧急联系人</view>
        </view>
        <view class="grid-item" @click="navigateTo('/pages/prescription/prescription')">
          <view class="grid-icon">📝</view>
          <view class="grid-text">电子处方</view>
        </view>
        <view class="grid-item" @click="navigateTo('/pages/video/video')">
          <view class="grid-icon">📹</view>
          <view class="grid-text">视频会诊</view>
        </view>
      </view>
    </view>

    <BottomNav />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'

const userName = ref('用户')

onMounted(() => {
  // 检查登录状态
  const isLogin = uni.getStorageSync('isLogin')
  if (!isLogin) {
    uni.reLaunch({ url: '/pages/login/login' })
    return
  }

  // 获取用户信息
  try {
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo && userInfo.name) {
      userName.value = userInfo.name
    }
  } catch (e) {
    console.error('获取用户信息失败', e)
  }
})

const navigateTo = (url) => {
  uni.navigateTo({ url })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f0f2f5;
  padding-bottom: 120rpx;
}

.content {
  padding: 24rpx;
}

.welcome-card {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 12rpx 32rpx rgba(24, 144, 255, 0.35);
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  width: 300rpx;
  height: 300rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -100rpx;
  right: -100rpx;
}

.welcome-text {
  font-size: 44rpx;
  font-weight: 600;
  color: white;
  margin-bottom: 12rpx;
  position: relative;
  z-index: 1;
}

.welcome-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 1;
  letter-spacing: 1rpx;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.grid-item {
  background: white;
  border-radius: 20rpx;
  padding: 48rpx 24rpx;
  text-align: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 2rpx solid transparent;
}

.grid-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.grid-item:active {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 24rpx rgba(24, 144, 255, 0.2);
  border-color: #40a9ff;
}

.grid-item:active::before {
  opacity: 0.05;
}

.grid-icon {
  font-size: 72rpx;
  margin-bottom: 16rpx;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.1));
}

.grid-text {
  font-size: 30rpx;
  color: #262626;
  font-weight: 500;
  position: relative;
  z-index: 1;
}
</style>
