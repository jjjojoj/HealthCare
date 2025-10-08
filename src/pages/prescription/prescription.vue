<template>
  <view class="container">
    <view class="card">
      <view class="title">电子处方</view>
      <view style="margin-top: 30rpx;">
        <view class="label">处方编号</view>
        <view style="font-size: 30rpx;">RX-2025100500123</view>
      </view>
      <view style="margin-top: 20rpx;">
        <view class="label">开方医生</view>
        <view style="font-size: 30rpx;">李医生</view>
      </view>
      <view style="margin-top: 20rpx;">
        <view class="label">开方日期</view>
        <view style="font-size: 30rpx;">2025-10-05</view>
      </view>
      <view style="margin-top: 30rpx;">
        <view class="label">药品清单</view>
        <view v-for="(item, index) in items" :key="index"
              style="background: #f5f5f5; padding: 20rpx; border-radius: 8rpx; margin-top: 10rpx;">
          <view style="font-weight: bold;">{{ item.name }}</view>
          <view style="color: #666; font-size: 26rpx; margin-top: 5rpx;">{{ item.spec }} × {{ item.quantity }}</view>
          <view style="color: #666; font-size: 26rpx; margin-top: 5rpx;">{{ item.usage }}</view>
        </view>
      </view>
      <view style="margin-top: 30rpx;">
        <view class="label">医嘱</view>
        <view style="font-size: 28rpx; color: #666;">按时服药，注意休息，一周后复诊</view>
      </view>
      <button class="btn" style="margin-top: 40rpx;">下载处方</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { name: '感冒清热颗粒', spec: '12g/袋', quantity: 7, usage: '每日3次，每次1袋' },
  { name: '阿莫西林胶囊', spec: '0.25g/粒', quantity: 21, usage: '每日3次，每次2粒' }
])
</script>
