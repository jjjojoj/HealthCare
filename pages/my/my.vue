<template>
  <view class="page">
    <AppHeader title="我的" />

    <view class="content">
      <view class="user-card">
        <view class="user-avatar">👤</view>
        <view class="user-info">
          <view class="user-name">{{ userInfo.name || '未登录' }}</view>
          <view class="user-phone">{{ userInfo.phone || '' }}</view>
        </view>
      </view>

      <view class="menu-list">
        <view class="menu-item" @click="navigateTo('/pages/emergency/emergency')">
          <view class="menu-icon">🚨</view>
          <view class="menu-text">紧急联系人</view>
          <view class="menu-arrow">→</view>
        </view>

        <view class="menu-item" @click="navigateTo('/pages/prescription/prescription')">
          <view class="menu-icon">📝</view>
          <view class="menu-text">电子处方</view>
          <view class="menu-arrow">→</view>
        </view>

        <view class="menu-item" @click="navigateTo('/pages/upload/upload')">
          <view class="menu-icon">📤</view>
          <view class="menu-text">上传文件</view>
          <view class="menu-arrow">→</view>
        </view>

        <view class="menu-item" @click="navigateTo('/pages/video/video')">
          <view class="menu-icon">📹</view>
          <view class="menu-text">视频会诊</view>
          <view class="menu-arrow">→</view>
        </view>
      </view>

      <view class="logout-section">
        <button class="logout-btn" @click="logout">退出登录</button>
      </view>
    </view>

    <BottomNav />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'

const userInfo = ref({})

onMounted(() => {
  // 获取用户信息
  try {
    const info = uni.getStorageSync('userInfo')
    if (info) {
      userInfo.value = info
    }
  } catch (e) {
    console.error('获取用户信息失败', e)
  }
})

const navigateTo = (url) => {
  uni.navigateTo({ url })
}

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除本地存储
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('isLogin')

        uni.showToast({ title: '已退出登录', icon: 'success' })

        setTimeout(() => {
          uni.reLaunch({ url: '/pages/login/login' })
        }, 1000)
      }
    }
  })
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

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.3);
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
  margin-right: 30rpx;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 10rpx;
}

.user-phone {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.menu-list {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: #f8f8f8;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.menu-arrow {
  font-size: 32rpx;
  color: #ccc;
}

.logout-section {
  padding: 20rpx 0;
}

.logout-btn {
  width: 100%;
  height: 90rpx;
  background: white;
  color: #f56c6c;
  border: none;
  border-radius: 20rpx;
  font-size: 32rpx;
  font-weight: bold;
}
</style>
