<template>
  <view class="app-header">
    <view class="header-left">
      <view v-if="showBack" class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <view v-else class="app-logo">🏥</view>
    </view>

    <view class="header-center">
      <text class="app-name">{{ title || '远程医疗' }}</text>
    </view>

    <view class="header-right">
      <view v-if="userName" class="user-info">
        <text class="user-name">{{ userName }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: false
  }
})

const userName = ref('')

onMounted(() => {
  // 从本地存储获取用户信息
  try {
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo && userInfo.name) {
      userName.value = userInfo.name
    }
  } catch (e) {
    console.error('获取用户信息失败', e)
  }

  // 自动判断是否显示返回按钮
  // 如果页面栈大于1，说明不是首页，应该显示返回按钮
})

const goBack = () => {
  const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : []
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/home/home' })
  }
}
</script>

<style scoped>
.app-header {
  height: 96rpx;
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 4rpx 16rpx rgba(24, 144, 255, 0.25);
  backdrop-filter: blur(10rpx);
}

.header-left {
  width: 120rpx;
  display: flex;
  align-items: center;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  transition: all 0.3s ease;
  backdrop-filter: blur(8rpx);
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.95);
}

.back-icon {
  color: white;
  font-size: 36rpx;
  font-weight: 600;
}

.app-logo {
  font-size: 52rpx;
  filter: drop-shadow(0 2rpx 8rpx rgba(0, 0, 0, 0.15));
}

.header-center {
  flex: 1;
  text-align: center;
}

.app-name {
  color: white;
  font-size: 36rpx;
  font-weight: 600;
  letter-spacing: 1rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.header-right {
  width: 120rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.user-info {
  background: rgba(255, 255, 255, 0.25);
  padding: 12rpx 24rpx;
  border-radius: 32rpx;
  backdrop-filter: blur(8rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
}

.user-name {
  color: white;
  font-size: 26rpx;
  font-weight: 500;
  white-space: nowrap;
}
</style>
