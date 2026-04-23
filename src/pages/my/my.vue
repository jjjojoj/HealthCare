<template>
  <view class="page">
    <AppHeader title="我的" />

    <view class="content">
      <view class="user-card">
        <view class="user-avatar">{{ (userInfo.name || 'U').charAt(0) }}</view>
        <view class="user-info">
          <view class="user-name">{{ userInfo.name || '未登录' }}</view>
          <view class="user-phone">{{ userInfo.phone || '' }}</view>
        </view>
        <view class="notification-badge" @click="navigateTo('/pages/notification/notification')">
          <text class="badge-icon">N</text>
          <view class="badge-dot"></view>
        </view>
      </view>

      <!-- 个人管理 -->
      <view class="menu-section">
        <text class="section-label">个人管理</text>
        <view class="menu-list">
          <view class="menu-item" @click="navigateTo('/pages/health-profile/health-profile')">
            <view class="menu-icon" style="background: rgba(250,140,22,0.12); color: #FA8C16;">P</view>
            <view class="menu-text">健康档案</view>
            <view class="menu-arrow">></view>
          </view>
          <view class="menu-item" @click="navigateTo('/pages/bmi/bmi')">
            <view class="menu-icon" style="background: rgba(114,46,209,0.12); color: #722ED1;">B</view>
            <view class="menu-text">BMI健康评估</view>
            <view class="menu-arrow">></view>
          </view>
          <view class="menu-item" @click="navigateTo('/pages/export/export')">
            <view class="menu-icon" style="background: rgba(245,34,45,0.12); color: #F5222D;">E</view>
            <view class="menu-text">数据导出</view>
            <view class="menu-arrow">></view>
          </view>
        </view>
      </view>

      <!-- 医疗服务 -->
      <view class="menu-section">
        <text class="section-label">医疗服务</text>
        <view class="menu-list">
          <view class="menu-item" @click="navigateTo('/pages/appointment/index')">
            <view class="menu-icon" style="background: rgba(55,205,135,0.12); color: #37CD87;">C</view>
            <view class="menu-text">预约挂号</view>
            <view class="menu-arrow">></view>
          </view>
          <view class="menu-item" @click="navigateTo('/pages/prescription/prescription')">
            <view class="menu-icon" style="background: rgba(24,144,255,0.12); color: #1890FF;">R</view>
            <view class="menu-text">电子处方</view>
            <view class="menu-arrow">></view>
          </view>
          <view class="menu-item" @click="navigateTo('/pages/video/video')">
            <view class="menu-icon" style="background: rgba(19,194,194,0.12); color: #13C2C2;">V</view>
            <view class="menu-text">视频会诊</view>
            <view class="menu-arrow">></view>
          </view>
          <view class="menu-item" @click="navigateTo('/pages/emergency/emergency')">
            <view class="menu-icon" style="background: rgba(245,34,45,0.12); color: #F5222D;">!</view>
            <view class="menu-text">紧急联系人</view>
            <view class="menu-arrow">></view>
          </view>
          <view class="menu-item" @click="navigateTo('/pages/upload/upload')">
            <view class="menu-icon" style="background: rgba(102,126,234,0.12); color: #667eea;">+</view>
            <view class="menu-text">上传文件</view>
            <view class="menu-arrow">></view>
          </view>
        </view>
      </view>

      <!-- 其他 -->
      <view class="menu-section">
        <text class="section-label">其他</text>
        <view class="menu-list">
          <view class="menu-item" @click="navigateTo('/pages/articles/index')">
            <view class="menu-icon" style="background: rgba(82,196,26,0.12); color: #52C41A;">A</view>
            <view class="menu-text">健康科普</view>
            <view class="menu-arrow">></view>
          </view>
          <view class="menu-item" @click="navigateTo('/pages/notification/notification')">
            <view class="menu-icon" style="background: rgba(250,173,20,0.12); color: #FAAD14;">N</view>
            <view class="menu-text">消息通知</view>
            <view class="menu-arrow">></view>
          </view>
          <view class="menu-item" @click="navigateTo('/pages/settings/settings')">
            <view class="menu-icon" style="background: rgba(140,140,140,0.12); color: #8C8C8C;">S</view>
            <view class="menu-text">设置</view>
            <view class="menu-arrow">></view>
          </view>
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
import { useAuthGuard } from '@/composables/useAuthGuard'
import { useAuth } from '@/composables/useAuth'

useAuthGuard()

const { userInfo, logout: authLogout } = useAuth()

const navigateTo = (url) => {
  uni.navigateTo({ url })
}

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出登录', icon: 'success' })
        setTimeout(() => {
          authLogout()
        }, 1000)
      }
    }
  })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 100rpx;
}

.content {
  padding: 20rpx 24rpx;
}

.user-card {
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  border-radius: 20rpx;
  padding: 40rpx 32rpx;
  display: flex;
  align-items: center;
  margin-bottom: 28rpx;
  box-shadow: 0 8rpx 24rpx rgba(55, 205, 135, 0.28);
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
}

.user-avatar {
  width: 100rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  margin-right: 24rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.5);
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
  margin-bottom: 8rpx;
}

.user-phone {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
}

.notification-badge {
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.badge-icon {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
}

.badge-dot {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #F5222D;
}

.section-label {
  font-size: 24rpx;
  color: #8C8C8C;
  font-weight: 500;
  margin-bottom: 12rpx;
  margin-left: 4rpx;
  display: block;
}

.menu-section {
  margin-bottom: 24rpx;
}

.menu-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #F5F5F5;

  &:last-child { border-bottom: none; }

  &:active {
    background: #FAFAFA;
  }
}

.menu-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  font-size: 24rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #262626;
  font-weight: 500;
}

.menu-arrow {
  font-size: 24rpx;
  color: #C0C0C0;
}

.logout-section {
  padding: 24rpx 0;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  background: #fff;
  color: #FF4D4F;
  border: 2rpx solid #FFCCC7;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: 0 2rpx 12rpx rgba(255, 77, 79, 0.08);
}
</style>
