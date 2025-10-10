<template>
  <view class="container">
    <view class="list-item" v-for="med in medications" :key="med.id">
      <view style="font-weight: bold; font-size: 32rpx;">{{ med.name }}</view>
      <view style="color: #666; font-size: 28rpx; margin-top: 10rpx;">用量: {{ med.dosage }}</view>
      <view style="color: #666; font-size: 28rpx; margin-top: 5rpx;">频次: {{ med.frequency }}</view>
      <view style="color: #666; font-size: 28rpx; margin-top: 5rpx;">疗程: {{ med.duration }}</view>
      <view style="color: #666; font-size: 28rpx; margin-top: 5rpx;">用法: {{ med.instructions }}</view>
      <view style="color: #999; font-size: 24rpx; margin-top: 10rpx;">开始日期: {{ med.startDate }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import medsData from '@/static/mock/meds.json'

const medications = ref(medsData.medications)
</script>
