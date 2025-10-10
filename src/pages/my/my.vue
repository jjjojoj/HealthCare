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
  background: #F8F9FA;
  padding-bottom: 100rpx;
}

.content {
  padding: 20rpx 16rpx;
}

.user-card {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  border-radius: 18rpx;
  padding: 40rpx 32rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(55, 205, 135, 0.28);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: '';
  position: absolute;
  top: -40%;
  right: -15%;
  width: 180rpx;
  height: 180rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  /* #ifdef H5 */
  filter: blur(35rpx);
  /* #endif */
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
  margin-right: 28rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
  border: 3rpx solid rgba(255, 255, 255, 0.5);
  /* #ifdef H5 */
  backdrop-filter: blur(12rpx);
  /* #endif */
  position: relative;
  z-index: 1;
}

.user-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.user-name {
  font-size: 34rpx;
  font-weight: 700;
  color: white;
  margin-bottom: 10rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.user-phone {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.menu-list {
  background: white;
  border-radius: 14rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #F0F0F0;
  transition: all 0.3s ease;
  position: relative;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: linear-gradient(90deg, rgba(55, 205, 135, 0.08) 0%, transparent 100%);
  transform: translateX(6rpx);
}

.menu-icon {
  font-size: 38rpx;
  margin-right: 20rpx;
  width: 44rpx;
  text-align: center;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}

.menu-arrow {
  font-size: 28rpx;
  color: #CCCCCC;
  transition: all 0.3s ease;
}

.menu-item:active .menu-arrow {
  color: #37CD87;
  transform: translateX(8rpx);
}

.logout-section {
  padding: 16rpx 0;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  background: white;
  color: #FF4D4F;
  border: 2rpx solid #FFCCC7;
  border-radius: 12rpx;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.12);
  transition: all 0.3s ease;
}

.logout-btn:active {
  background: #FFF1F0;
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(255, 77, 79, 0.15);
}
</style>
