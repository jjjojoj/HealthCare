<template>
  <view class="login-container">
    <view class="login-card">
      <view class="login-header">
        <view class="app-icon">🏥</view>
        <view class="app-title">远程医疗管理系统</view>
        <view class="app-subtitle">Healthcare Management</view>
      </view>

      <view class="login-form">
        <view class="form-item">
          <view class="label">用户名</view>
          <input
            class="input"
            v-model="username"
            placeholder="请输入用户名"
            @confirm="login"
          />
        </view>

        <view class="form-item">
          <view class="label">密码</view>
          <input
            class="input"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            @confirm="login"
          />
        </view>

        <button class="login-btn" @click="login" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <view class="login-tip">
          演示账号: demo / demo
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import usersData from '@/static/mock/users.json'

const username = ref('demo')
const password = ref('demo')
const loading = ref(false)

const login = () => {
  if (!username.value || !password.value) {
    uni.showToast({ title: '请输入用户名和密码', icon: 'none' })
    return
  }

  // 验证用户名密码（写死 demo/demo）
  if (username.value === 'demo' && password.value === 'demo') {
    loading.value = true

    // 从 users.json 读取第一个用户信息
    const userInfo = usersData.users[0]

    // 保存用户信息到本地存储
    uni.setStorageSync('userInfo', userInfo)
    uni.setStorageSync('isLogin', true)

    uni.showToast({ title: '登录成功', icon: 'success' })

    setTimeout(() => {
      loading.value = false
      // 使用 switchTab 跳转到首页（因为首页在 tabBar 中）
      uni.switchTab({ url: '/pages/home/home' })
    }, 1000)
  } else {
    uni.showToast({ title: '用户名或密码错误', icon: 'none' })
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  width: 600rpx;
  height: 600rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -200rpx;
  right: -200rpx;
}

.login-container::after {
  content: '';
  position: absolute;
  width: 400rpx;
  height: 400rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  bottom: -100rpx;
  left: -100rpx;
}

.login-card {
  width: 100%;
  max-width: 600rpx;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  padding: 64rpx 48rpx;
  box-shadow: 0 24rpx 80rpx rgba(0, 80, 179, 0.35);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 64rpx;
}

.app-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10rpx); }
}

.app-title {
  font-size: 44rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12rpx;
  letter-spacing: 1rpx;
}

.app-subtitle {
  font-size: 26rpx;
  color: #8c8c8c;
  letter-spacing: 3rpx;
  text-transform: uppercase;
}

.login-form {
  width: 100%;
}

.form-item {
  margin-bottom: 32rpx;
}

.label {
  font-size: 28rpx;
  color: #595959;
  margin-bottom: 16rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.label::before {
  content: '';
  width: 6rpx;
  height: 6rpx;
  background: #1890ff;
  border-radius: 50%;
  margin-right: 8rpx;
}

.input {
  width: 100%;
  height: 96rpx;
  border: 2rpx solid #d9d9d9;
  border-radius: 16rpx;
  padding: 0 32rpx;
  font-size: 30rpx;
  box-sizing: border-box;
  transition: all 0.3s ease;
  background: #fafafa;
}

.input:focus {
  border-color: #1890ff;
  background: #f0f7ff;
  box-shadow: 0 0 0 4rpx rgba(24, 144, 255, 0.1);
}

.login-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 34rpx;
  font-weight: 600;
  margin-top: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(24, 144, 255, 0.4);
  transition: all 0.3s ease;
}

.login-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 16rpx rgba(24, 144, 255, 0.3);
}

.login-btn[disabled] {
  opacity: 0.6;
  transform: none;
}

.login-tip {
  text-align: center;
  color: #8c8c8c;
  font-size: 26rpx;
  margin-top: 32rpx;
  padding: 16rpx;
  background: #f0f7ff;
  border-radius: 12rpx;
  border: 1rpx dashed #91d5ff;
}
</style>
