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
  background: #f5f5f5;
  padding-bottom: 100rpx;
}

.content {
  padding: 20rpx;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.3);
}

.welcome-text {
  font-size: 40rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 10rpx;
}

.welcome-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.grid-item {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 20rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.grid-item:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
}

.grid-icon {
  font-size: 60rpx;
  margin-bottom: 15rpx;
}

.grid-text {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}
</style>
