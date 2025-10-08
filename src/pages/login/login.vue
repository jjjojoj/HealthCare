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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.login-card {
  width: 100%;
  max-width: 600rpx;
  background: white;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 60rpx;
}

.app-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.app-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.app-subtitle {
  font-size: 24rpx;
  color: #999;
  letter-spacing: 2rpx;
}

.login-form {
  width: 100%;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 15rpx;
  font-weight: 500;
}

.input {
  width: 100%;
  height: 90rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 30rpx;
  font-size: 30rpx;
  box-sizing: border-box;
  transition: all 0.3s;
}

.input:focus {
  border-color: #667eea;
  background: #f8f9ff;
}

.login-btn {
  width: 100%;
  height: 90rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn[disabled] {
  opacity: 0.6;
}

.login-tip {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  margin-top: 30rpx;
}
</style>
