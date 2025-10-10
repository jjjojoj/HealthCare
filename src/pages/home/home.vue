<template>
  <view class="page">
    <AppHeader title="健康中心" />

    <view class="content">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="user-left">
          <view class="avatar">{{ userName.charAt(0) }}</view>
          <view class="user-info">
            <view class="user-greeting">{{ greeting }}，{{ userName }}</view>
            <view class="user-status">
              <view class="status-dot"></view>
              <text class="status-text">健康状况良好</text>
            </view>
          </view>
        </view>
        <view class="user-right" @click="navigateTo('/pages/my/my')">
          <text class="settings-icon">◎</text>
        </view>
      </view>

      <!-- 顶部快捷功能 - 三大功能（横向） -->
      <view class="top-actions">
        <view class="action-card-horizontal" @click="navigateTo('/pages/upload/upload')">
          <view class="action-icon-bg upload">
            <text class="action-icon">↑</text>
          </view>
          <view class="action-title">上传检查</view>
          <view class="action-subtitle">AI分析</view>
        </view>
        
        <view class="action-card-horizontal" @click="navigateTo('/pages/meds/meds')">
          <view class="action-icon-bg meds">
            <text class="action-icon">+</text>
          </view>
          <view class="action-title">用药助手</view>
          <view class="action-subtitle">智能提醒</view>
        </view>
        
        <view class="action-card-horizontal" @click="navigateTo('/pages/trends/trends')">
          <view class="action-icon-bg analysis">
            <text class="action-icon">≡</text>
          </view>
          <view class="action-title">健康分析</view>
          <view class="action-subtitle">数据洞察</view>
        </view>
      </view>

      <!-- 健康数据仪表盘 -->
      <view class="dashboard-section">
        <view class="section-header">
          <view class="header-title">健康仪表盘</view>
          <view class="header-subtitle">实时监测您的健康状态</view>
        </view>
        <HealthDashboard />
      </view>

      <!-- 占位空间 -->
      <view style="height: 40rpx;"></view>
    </view>

    <BottomNav />
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import HealthDashboard from '@/components/HealthDashboard.vue'
import { useAuth } from '@/composables/useAuth'

const { checkAuth, userName } = useAuth()

// 计算问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了'
})

onMounted(() => {
  // 检查登录状态
  const isAuthenticated = checkAuth()
  if (!isAuthenticated) {
    uni.reLaunch({ url: '/pages/login/login' })
  }
})

const navigateTo = (url) => {
  // 判断是否是 tabBar 页面
  const tabBarPages = [
    '/pages/home/home',
    '/pages/records/list',
    '/pages/chatbot/chat',
    '/pages/my/my'
  ]
  
  if (tabBarPages.includes(url)) {
    uni.switchTab({ url })
  } else {
    uni.navigateTo({ url })
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/platform-import.scss';

.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F9F4 0%, #FFFFFF 100%);
  padding-bottom: 120rpx;
}

.content {
  padding: 24rpx 20rpx;
}

/* 用户信息卡片 - 绿色渐变背景 */
.user-card {
  background: var(--gradient-primary);
  border-radius: var(--radius-2xl);
  padding: 32rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 12rpx 36rpx rgba(55, 205, 135, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  /* #ifdef H5 */
  backdrop-filter: blur(20rpx);
  /* #endif */
}

/* 卡片装饰背景 - 更精致的光晕 */
.user-card::before {
  content: '';
  position: absolute;
  top: -100rpx;
  right: -100rpx;
  width: 300rpx;
  height: 300rpx;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.user-card::after {
  content: '';
  position: absolute;
  bottom: -80rpx;
  left: -80rpx;
  width: 250rpx;
  height: 250rpx;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20rpx, -20rpx);
  }
}

.user-left {
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
  z-index: 1;
}

.avatar {
  width: 110rpx;
  height: 110rpx;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.25);
  /* #ifdef H5 */
  backdrop-filter: blur(20rpx);
  /* #endif */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  font-weight: var(--weight-bold);
  color: white;
  margin-right: 28rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.6);
  box-shadow: var(--shadow-lg);
  position: relative;
  z-index: 1;
}

.avatar::after {
  content: '';
  position: absolute;
  inset: -8rpx;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent);
  z-index: -1;
  opacity: 0.5;
}

.user-info {
  flex: 1;
}

.user-greeting {
  font-size: 32rpx;
  font-weight: var(--weight-bold);
  color: white;
  margin-bottom: 8rpx;
  text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5rpx;
}

.user-status {
  display: flex;
  align-items: center;
}

.status-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #52c41a;
  margin-right: 8rpx;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.user-right {
  position: relative;
  z-index: 1;
}

.settings-icon {
  font-size: 48rpx;
  filter: drop-shadow(0 4rpx 12rpx rgba(0, 0, 0, 0.15));
}

/* 顶部快捷功能 - 横向布局 */
.top-actions {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
  margin-bottom: 28rpx;
}

.action-card-horizontal {
  flex: 1;
  background: white;
  border-radius: 20rpx;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  border: 2rpx solid rgba(55, 205, 135, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-card-horizontal:active {
  transform: translateY(-4rpx);
  box-shadow: var(--shadow-md);
}

.action-icon-bg {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 12rpx;
  
  &.upload {
    background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  }
  
  &.meds {
    background: linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%);
  }
  
  &.analysis {
    background: linear-gradient(135deg, #FA709A 0%, #FEE140 100%);
  }
}

.action-icon {
  font-size: 40rpx;
}

.action-title {
  font-size: 28rpx;
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: 4rpx;
  text-align: center;
}

.action-subtitle {
  font-size: 22rpx;
  color: var(--color-text-tertiary);
  text-align: center;
}

/* 仪表盘区块 */
.dashboard-section {
  margin-bottom: 24rpx;
}

.section-header {
  padding: 0 8rpx 20rpx;
}

.header-title {
  font-size: 32rpx;
  font-weight: var(--weight-bold);
  color: var(--color-text-primary);
  margin-bottom: 6rpx;
  position: relative;
  padding-left: 24rpx;
  letter-spacing: 0.5rpx;
}

.header-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8rpx;
  height: 36rpx;
  background: var(--gradient-primary);
  border-radius: 4rpx;
  box-shadow: 0 2rpx 8rpx rgba(55, 205, 135, 0.25);
}

.header-subtitle {
  font-size: 24rpx;
  color: var(--color-text-tertiary);
  padding-left: 24rpx;
}

</style>
