<template>
  <view class="bottom-nav">
    <view
      v-for="item in navItems"
      :key="item.path"
      class="nav-item"
      :class="{ active: currentPath === item.path }"
      @click="switchTab(item.path)"
    >
      <view class="nav-icon-wrapper">
        <text class="nav-icon">{{ item.icon }}</text>
      </view>
      <text class="nav-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const navItems = ref([
  {
    path: '/pages/home/home',
    icon: '🏠',
    text: '首页'
  },
  {
    path: '/pages/records/list',
    icon: '📋',
    text: '病历'
  },
  {
    path: '/pages/chatbot/chat',
    icon: '💬',
    text: '咨询'
  },
  {
    path: '/pages/my/my',
    icon: '👤',
    text: '我的'
  }
])

const currentPath = ref('')

onMounted(() => {
  // 获取当前页面路径
  const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : []
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    currentPath.value = '/' + (currentPage.route || currentPage.__route__ || '')
  }
})

const switchTab = (path) => {
  if (currentPath.value === path) return

  uni.switchTab({
    url: path,
    success: () => {
      currentPath.value = path
    },
    fail: () => {
      // 如果不是 tabBar 页面,使用 navigateTo
      uni.navigateTo({ url: path })
    }
  })
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30rpx) saturate(180%);
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1rpx solid rgba(225, 232, 237, 0.8);
  box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.04);
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  padding: 12rpx 0;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 活跃状态背景 */
.nav-item.active::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100rpx;
  height: 100rpx;
  background: radial-gradient(circle, rgba(78, 205, 196, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  animation: navPulse 2s ease-in-out infinite;
}

@keyframes navPulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(0.9);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.nav-icon-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item.active .nav-icon-wrapper {
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.15) 0%, rgba(68, 168, 242, 0.15) 100%);
  transform: translateY(-4rpx);
}

.nav-icon {
  font-size: 44rpx;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: grayscale(70%) opacity(0.7);
  position: relative;
  z-index: 1;
}

.nav-item.active .nav-icon {
  filter: grayscale(0%) opacity(1);
  transform: scale(1.1);
}

.nav-text {
  font-size: 22rpx;
  color: #BDC3C7;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.nav-item.active .nav-text {
  color: #4ECDC4;
  font-weight: 700;
  transform: scale(1.05);
}

/* 点击效果 */
.nav-item:active {
  transform: scale(0.92);
}

/* 活跃指示器 */
.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #4ECDC4 0%, #44A8F2 100%);
  border-radius: 4rpx 4rpx 0 0;
  box-shadow: 0 -2rpx 8rpx rgba(78, 205, 196, 0.4);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(8rpx) scaleX(0.3);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scaleX(1);
  }
}
</style>
