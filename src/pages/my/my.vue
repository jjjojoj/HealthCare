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
  padding: 24rpx;
}

.user-card {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  border-radius: 24rpx;
  padding: 44rpx;
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  box-shadow: 0 10rpx 24rpx rgba(24, 144, 255, 0.35);
  transition: all 0.3s ease;
}

.user-avatar {
  width: 128rpx;
  height: 128rpx;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  margin-right: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  border: 3rpx solid rgba(255, 255, 255, 0.4);
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
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: 0 6rpx 16rpx rgba(24, 144, 255, 0.08);
  border: 1px solid rgba(24, 144, 255, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: linear-gradient(90deg, #e6f4ff 0%, transparent 100%);
  transform: translateX(4rpx);
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
  color: #bfbfbf;
  transition: all 0.3s ease;
}

.menu-item:active .menu-arrow {
  color: #1890ff;
  transform: translateX(6rpx);
}

.logout-section {
  padding: 20rpx 0;
}

.logout-btn {
  width: 100%;
  height: 96rpx;
  background: white;
  color: #ff4d4f;
  border: 2rpx solid #ffccc7;
  border-radius: 24rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.15);
  transition: all 0.3s ease;
}

.logout-btn:active {
  background: #fff1f0;
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(255, 77, 79, 0.2);
}
</style>
