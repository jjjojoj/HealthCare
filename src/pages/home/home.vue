<template>
  <view class="page">
    <AppHeader title="健康中心" />

    <view class="content">
      <!-- 用户信息卡片 - 增强版 -->
      <view class="user-card">
        <view class="card-background">
          <view class="bg-circle bg-circle-1"></view>
          <view class="bg-circle bg-circle-2"></view>
          <view class="bg-circle bg-circle-3"></view>
        </view>
        
        <view class="user-left">
          <view class="avatar-container">
            <view class="avatar">{{ userName.charAt(0) }}</view>
            <view class="avatar-ring"></view>
          </view>
          <view class="user-info">
            <view class="user-greeting">{{ greeting }}，{{ userName }}</view>
            <view class="user-status">
              <view class="status-indicator">
                <view class="status-dot"></view>
                <view class="status-pulse"></view>
              </view>
              <text class="status-text">健康状况良好</text>
            </view>
            <view class="user-meta">
              <text class="meta-text">今日已登录 • {{ formatDate(new Date()) }}</text>
            </view>
          </view>
        </view>
        
        <view class="user-right" @click="navigateTo('/pages/my/my')">
          <view class="settings-btn">
            <text class="settings-icon">⚙</text>
          </view>
        </view>
      </view>

      <!-- 快捷功能区域 - 增强版 -->
      <view class="quick-actions-section">
        <view class="section-title">
          <text class="title-text">快捷服务</text>
          <text class="title-subtitle">一键直达常用功能</text>
        </view>
        
        <view class="quick-actions">
          <view class="action-card upload-card" @click="navigateTo('/pages/upload/upload')">
            <view class="action-icon-bg upload">
              <view class="icon-wrapper">
                <text class="action-icon">📤</text>
                <view class="icon-glow"></view>
              </view>
            </view>
            <view class="action-text">
              <view class="action-title">上传检查</view>
              <view class="action-subtitle">AI智能分析</view>
            </view>
            <view class="action-arrow">
              <text class="arrow-icon">→</text>
            </view>
          </view>

          <view class="action-card meds-card" @click="navigateTo('/pages/meds/meds')">
            <view class="action-icon-bg meds">
              <view class="icon-wrapper">
                <text class="action-icon">💊</text>
                <view class="icon-glow"></view>
              </view>
            </view>
            <view class="action-text">
              <view class="action-title">用药助手</view>
              <view class="action-subtitle">智能提醒</view>
            </view>
            <view class="action-arrow">
              <text class="arrow-icon">→</text>
            </view>
          </view>

          <view class="action-card analysis-card" @click="navigateTo('/pages/trends/trends')">
            <view class="action-icon-bg analysis">
              <view class="icon-wrapper">
                <text class="action-icon">📊</text>
                <view class="icon-glow"></view>
              </view>
            </view>
            <view class="action-text">
              <view class="action-title">健康分析</view>
              <view class="action-subtitle">数据洞察</view>
            </view>
            <view class="action-arrow">
              <text class="arrow-icon">→</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 健康数据仪表盘（全宽） -->
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

// 格式化日期
const formatDate = (date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }
}

.home-container {
  position: relative;
  z-index: 1;
  padding: 0 20rpx 40rpx;
}

// 用户信息卡片
.user-info-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  padding: 32rpx;
  margin: 20rpx 0 32rpx;
  box-shadow: 
    0 20rpx 60rpx rgba(0, 0, 0, 0.1),
    0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(20rpx);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active {
    transform: translateY(-4rpx);
    box-shadow: 
      0 24rpx 80rpx rgba(0, 0, 0, 0.15),
      0 12rpx 32rpx rgba(0, 0, 0, 0.1);
  }
  
  .card-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(102, 126, 234, 0.05) 0%, 
      rgba(118, 75, 162, 0.05) 50%,
      rgba(255, 255, 255, 0.1) 100%);
    
    .bg-circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, 
        rgba(102, 126, 234, 0.1) 0%, 
        rgba(118, 75, 162, 0.1) 100%);
      animation: float 6s ease-in-out infinite;
      
      &.bg-circle-1 {
        width: 120rpx;
        height: 120rpx;
        top: -60rpx;
        right: -60rpx;
        animation-delay: 0s;
      }
      
      &.bg-circle-2 {
        width: 80rpx;
        height: 80rpx;
        bottom: -40rpx;
        left: -40rpx;
        animation-delay: 2s;
      }
      
      &.bg-circle-3 {
        width: 60rpx;
        height: 60rpx;
        top: 50%;
        right: 20rpx;
        animation-delay: 4s;
      }
    }
  }
  
  .user-info-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .user-left {
    display: flex;
    align-items: center;
    flex: 1;
  }
  
  .avatar-container {
    position: relative;
    margin-right: 24rpx;
    
    .avatar-ring {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: -4rpx;
        left: -4rpx;
        right: -4rpx;
        bottom: -4rpx;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        opacity: 0.3;
        animation: pulse-ring 2s ease-in-out infinite;
      }
      
      .avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 36rpx;
        font-weight: 600;
        box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
      }
    }
  }
  
  .user-info {
    flex: 1;
    
    .user-greeting {
      font-size: 32rpx;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 8rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .user-status {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      
      .status-indicator {
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        background: #28c76f;
        margin-right: 12rpx;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          top: -4rpx;
          left: -4rpx;
          right: -4rpx;
          bottom: -4rpx;
          border-radius: 50%;
          background: #28c76f;
          opacity: 0.3;
          animation: status-pulse 2s ease-in-out infinite;
        }
      }
      
      .status-text {
        font-size: 24rpx;
        color: #28c76f;
        font-weight: 500;
      }
    }
    
    .user-meta {
      .meta-text {
        font-size: 24rpx;
        color: #7f8c8d;
        line-height: 1.4;
      }
    }
  }
  
  .user-right {
    .settings-btn {
      width: 80rpx;
      height: 80rpx;
      border-radius: 20rpx;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10rpx);
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.9);
        background: rgba(255, 255, 255, 0.9);
      }
      
      .settings-icon {
        font-size: 32rpx;
        color: #667eea;
      }
    }
  }
}

// 快捷功能区域
.quick-actions-section {
  margin-bottom: 32rpx;
  
  .section-title {
    font-size: 36rpx;
    font-weight: 700;
    color: white;
    margin-bottom: 8rpx;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }
  
  .section-subtitle {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 24rpx;
  }
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  
  .action-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20rpx;
    padding: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 
      0 12rpx 40rpx rgba(0, 0, 0, 0.08),
      0 4rpx 16rpx rgba(0, 0, 0, 0.04);
    backdrop-filter: blur(20rpx);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:active {
      transform: translateY(-6rpx);
      box-shadow: 
        0 20rpx 60rpx rgba(0, 0, 0, 0.12),
        0 8rpx 24rpx rgba(0, 0, 0, 0.08);
      
      &::before {
        opacity: 1;
      }
    }
    
    &.upload-card {
      border-left: 6rpx solid #667eea;
      
      .action-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    }
    
    &.medication-card {
      border-left: 6rpx solid #f093fb;
      
      .action-icon {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
    }
    
    &.analysis-card {
      border-left: 6rpx solid #4facfe;
      
      .action-icon {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
    }
  }
  
  .action-left {
    display: flex;
    align-items: center;
    flex: 1;
  }
  
  .action-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    position: relative;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
    
    &::after {
      content: '';
      position: absolute;
      top: -2rpx;
      left: -2rpx;
      right: -2rpx;
      bottom: -2rpx;
      border-radius: 22rpx;
      background: inherit;
      opacity: 0.3;
      animation: glow-pulse 3s ease-in-out infinite;
    }
    
    .icon-text {
      font-size: 36rpx;
      color: white;
      font-weight: 600;
    }
  }
  
  .action-content {
    flex: 1;
    
    .action-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 8rpx;
    }
    
    .action-desc {
      font-size: 24rpx;
      color: #7f8c8d;
      line-height: 1.4;
    }
  }
  
  .action-right {
    .action-arrow {
      font-size: 32rpx;
      color: #bdc3c7;
      transition: all 0.3s ease;
    }
  }
  
  .action-card:active .action-arrow {
    color: #3498db;
    transform: translateX(6rpx);
  }
}

// 健康仪表盘区域
.health-dashboard-section {
  margin-top: 32rpx;
  
  .dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
    
    .header-title {
      font-size: 36rpx;
      font-weight: 700;
      color: white;
      text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
    }
    
    .header-badge {
      font-size: 20rpx;
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.2);
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      backdrop-filter: blur(10rpx);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
  }
}

// 动画效果
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}

@keyframes status-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.1;
  }
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

// 响应式适配
@media (max-width: 750rpx) {
  .user-info-card {
    .user-info-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 20rpx;
    }
    
    .user-left {
      width: 100%;
    }
    
    .user-right {
      align-self: flex-end;
    }
  }
  
  .quick-actions {
    .action-card {
      .action-left {
        flex-direction: column;
        align-items: flex-start;
        gap: 16rpx;
      }
      
      .action-icon {
        margin-right: 0;
      }
    }
  }
}
</style>
