<template>
  <view class="bottom-nav">
    <view
      v-for="item in navItems"
      :key="item.path"
      class="nav-item"
      :class="{ active: currentPath === item.path }"
      @click="switchTab(item.path)"
    >
      <view class="nav-icon">{{ item.icon }}</view>
      <view class="nav-text">{{ item.text }}</view>
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
      // 如果不是 tabBar 页面，使用 navigateTo
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
  height: 100rpx;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #eee;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
  z-index: 999;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rpx 0;
  transition: all 0.3s;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-item.active .nav-text {
  color: #667eea;
  font-weight: bold;
}

.nav-icon {
  font-size: 44rpx;
  margin-bottom: 5rpx;
  transition: transform 0.3s;
}

.nav-text {
  font-size: 22rpx;
  color: #666;
  transition: all 0.3s;
}
</style>
