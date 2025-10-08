<template>
  <view class="container">
    <view class="list-item" v-for="record in records" :key="record.id" @click="viewDetail(record.id)">
      <view style="font-weight: bold; font-size: 32rpx;">{{ record.diagnosis }}</view>
      <view style="color: #666; font-size: 28rpx; margin-top: 10rpx;">医生: {{ record.doctor }}</view>
      <view style="color: #666; font-size: 28rpx; margin-top: 5rpx;">日期: {{ record.date }}</view>
      <view style="color: #666; font-size: 28rpx; margin-top: 5rpx;">医院: {{ record.hospital }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import recordsData from '@/static/mock/records.json'

const records = ref(recordsData.records)

const viewDetail = (id) => {
  uni.navigateTo({ url: `/pages/records/detail?id=${id}` })
}
</script>
