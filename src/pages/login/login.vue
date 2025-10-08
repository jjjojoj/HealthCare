<template>
  <view class="container">
    <view class="card" style="margin-top: 100rpx;">
      <view class="title">远程医疗管理系统</view>
      <view style="margin-top: 40rpx;">
        <view class="label">用户名</view>
        <input class="input" v-model="username" placeholder="请输入用户名" />
      </view>
      <view style="margin-top: 30rpx;">
        <view class="label">密码</view>
        <input class="input" v-model="password" type="password" placeholder="请输入密码" />
      </view>
      <button class="btn" style="margin-top: 50rpx;" @click="login">登录</button>
      <view style="margin-top: 20rpx; text-align: center; color: #999; font-size: 24rpx;">
        演示账号: demo / 123456
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const username = ref('demo')
const password = ref('123456')

const login = () => {
  if (username.value === 'demo' && password.value === '123456') {
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.redirectTo({ url: '/pages/home/home' })
    }, 1000)
  } else {
    uni.showToast({ title: '用户名或密码错误', icon: 'none' })
  }
}
</script>
