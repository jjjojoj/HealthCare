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
import { getCurrentPages } from '@dcloudio/uni-app'

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
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/home/home' })
  }
}
</script>

<style scoped>
.app-header {
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.2);
}

.header-left {
  width: 120rpx;
  display: flex;
  align-items: center;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.back-icon {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
}

.app-logo {
  font-size: 48rpx;
}

.header-center {
  flex: 1;
  text-align: center;
}

.app-name {
  color: white;
  font-size: 34rpx;
  font-weight: bold;
}

.header-right {
  width: 120rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.user-info {
  background: rgba(255, 255, 255, 0.2);
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
}

.user-name {
  color: white;
  font-size: 24rpx;
  white-space: nowrap;
}
</style>
