<template>
  <view class="container">
    <view class="card">
      <view class="title">视频会诊</view>
      <view style="background: #000; height: 400rpx; border-radius: 10rpx; margin-top: 30rpx; display: flex; align-items: center; justify-content: center;">
        <view style="color: white; font-size: 32rpx;">视频画面占位区域</view>
      </view>
      <view style="margin-top: 30rpx;">
        <view class="label">会诊医生</view>
        <view style="font-size: 30rpx;">李医生 - 心内科主任</view>
      </view>
      <view style="margin-top: 20rpx;">
        <view class="label">预约时间</view>
        <view style="font-size: 30rpx;">2025-10-08 14:00</view>
      </view>
      <view style="display: flex; gap: 20rpx; margin-top: 40rpx;">
        <button class="btn" style="flex: 1;">发起会诊</button>
        <button class="btn btn-secondary" style="flex: 1;">预约会诊</button>
      </view>
    </view>
  </view>
</template>

<script setup>
</script>
