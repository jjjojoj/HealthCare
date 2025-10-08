<template>
  <view class="container">
    <view class="card">
      <view class="title">欢迎，张三</view>
      <view style="color: #666; font-size: 28rpx;">远程医疗管理系统</view>
    </view>

    <view class="grid">
      <view class="grid-item" @click="navigateTo('/pages/records/list')">
        <view style="font-size: 50rpx;">📋</view>
        <view style="margin-top: 20rpx;">病历列表</view>
      </view>
      <view class="grid-item" @click="navigateTo('/pages/upload/upload')">
        <view style="font-size: 50rpx;">📤</view>
        <view style="margin-top: 20rpx;">上传文件</view>
      </view>
      <view class="grid-item" @click="navigateTo('/pages/chatbot/chat')">
        <view style="font-size: 50rpx;">💬</view>
        <view style="margin-top: 20rpx;">智能咨询</view>
      </view>
      <view class="grid-item" @click="navigateTo('/pages/trends/trends')">
        <view style="font-size: 50rpx;">📊</view>
        <view style="margin-top: 20rpx;">健康趋势</view>
      </view>
      <view class="grid-item" @click="navigateTo('/pages/meds/meds')">
        <view style="font-size: 50rpx;">💊</view>
        <view style="margin-top: 20rpx;">用药助手</view>
      </view>
      <view class="grid-item" @click="navigateTo('/pages/emergency/emergency')">
        <view style="font-size: 50rpx;">🚨</view>
        <view style="margin-top: 20rpx;">紧急联系人</view>
      </view>
      <view class="grid-item" @click="navigateTo('/pages/prescription/prescription')">
        <view style="font-size: 50rpx;">📝</view>
        <view style="margin-top: 20rpx;">电子处方</view>
      </view>
      <view class="grid-item" @click="navigateTo('/pages/video/video')">
        <view style="font-size: 50rpx;">📹</view>
        <view style="margin-top: 20rpx;">视频会诊</view>
      </view>
    </view>
  </view>
</template>

<script setup>
const navigateTo = (url) => {
  uni.navigateTo({ url })
}
</script>
