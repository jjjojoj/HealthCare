<template>
  <view class="home-page">
    <AppHeader title="健康中心" />

    <view class="home-container">
      <!-- 搜索栏 -->
      <view class="search-bar" @click="navigateTo('/pages/search/search')">
        <text class="search-icon">/</text>
        <text class="search-placeholder">搜索病历、药品、科普文章...</text>
      </view>

      <!-- 用户信息卡片 - 增强版 -->
      <view class="user-info-card">
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

      <!-- 快捷功能区域 - 8宫格 -->
      <view class="quick-actions-section">
        <view class="section-title">快捷服务</view>
        <view class="section-subtitle">一键直达常用功能</view>
        
        <view class="quick-grid">
          <view class="grid-item" @click="navigateTo('/pages/upload/upload')">
            <view class="grid-icon" style="background: rgba(102,126,234,0.12);">
              <text class="grid-icon-text" style="color: #667eea;">+</text>
            </view>
            <text class="grid-label">上传检查</text>
          </view>
          <view class="grid-item" @click="navigateTo('/pages/meds/meds')">
            <view class="grid-icon" style="background: rgba(240,147,251,0.12);">
              <text class="grid-icon-text" style="color: #f093fb;">Rx</text>
            </view>
            <text class="grid-label">用药助手</text>
          </view>
          <view class="grid-item" @click="navigateTo('/pages/trends/trends')">
            <view class="grid-icon" style="background: rgba(79,172,254,0.12);">
              <text class="grid-icon-text" style="color: #4facfe;">T</text>
            </view>
            <text class="grid-label">健康分析</text>
          </view>
          <view class="grid-item" @click="navigateTo('/pages/appointment/index')">
            <view class="grid-icon" style="background: rgba(55,205,135,0.12);">
              <text class="grid-icon-text" style="color: #37CD87;">C</text>
            </view>
            <text class="grid-label">预约挂号</text>
          </view>
          <view class="grid-item" @click="navigateTo('/pages/health-profile/health-profile')">
            <view class="grid-icon" style="background: rgba(250,140,22,0.12);">
              <text class="grid-icon-text" style="color: #FA8C16;">P</text>
            </view>
            <text class="grid-label">健康档案</text>
          </view>
          <view class="grid-item" @click="navigateTo('/pages/bmi/bmi')">
            <view class="grid-icon" style="background: rgba(114,46,209,0.12);">
              <text class="grid-icon-text" style="color: #722ED1;">B</text>
            </view>
            <text class="grid-label">BMI评估</text>
          </view>
          <view class="grid-item" @click="navigateTo('/pages/articles/index')">
            <view class="grid-icon" style="background: rgba(19,194,194,0.12);">
              <text class="grid-icon-text" style="color: #13C2C2;">A</text>
            </view>
            <text class="grid-label">健康科普</text>
          </view>
          <view class="grid-item" @click="navigateTo('/pages/export/export')">
            <view class="grid-icon" style="background: rgba(245,34,45,0.12);">
              <text class="grid-icon-text" style="color: #F5222D;">E</text>
            </view>
            <text class="grid-label">数据导出</text>
          </view>
        </view>
      </view>

      <!-- 健康数据仪表盘（全宽） -->
      <view class="health-dashboard-section">
        <view class="dashboard-header">
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
import { computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import HealthDashboard from '@/components/HealthDashboard.vue'
import { useAuth } from '@/composables/useAuth'
import { useAuthGuard } from '@/composables/useAuthGuard'

useAuthGuard()
const { userName } = useAuth()

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

// 搜索栏
.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40rpx;
  padding: 16rpx 28rpx;
  margin: 16rpx 0 24rpx;
  gap: 12rpx;
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.15);

  .search-icon {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.6);
  }

  .search-placeholder {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.5);
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

.quick-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .grid-item {
    width: calc((100% - 32rpx) / 3);
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16rpx;
    padding: 24rpx 12rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(20rpx);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
    }
  }

  .grid-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .grid-icon-text {
    font-size: 28rpx;
    font-weight: 700;
  }

  .grid-label {
    font-size: 24rpx;
    color: #595959;
    font-weight: 500;
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
