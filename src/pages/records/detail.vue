<template>
  <view class="container">
    <view class="card" v-if="record">
      <view class="title">{{ record.diagnosis }}</view>
      <view style="margin-top: 30rpx;">
        <view class="label">患者姓名</view>
        <view style="font-size: 30rpx;">{{ record.patientName }}</view>
      </view>
      <view style="margin-top: 20rpx;">
        <view class="label">就诊日期</view>
        <view style="font-size: 30rpx;">{{ record.date }}</view>
      </view>
      <view style="margin-top: 20rpx;">
        <view class="label">主治医生</view>
        <view style="font-size: 30rpx;">{{ record.doctor }}</view>
      </view>
      <view style="margin-top: 20rpx;">
        <view class="label">就诊医院</view>
        <view style="font-size: 30rpx;">{{ record.hospital }}</view>
      </view>
      <view style="margin-top: 20rpx;">
        <view class="label">症状描述</view>
        <view style="font-size: 30rpx;">{{ record.symptoms }}</view>
      </view>
      <view style="margin-top: 20rpx;">
        <view class="label">治疗方案</view>
        <view style="font-size: 30rpx;">{{ record.treatment }}</view>
      </view>
      <view style="margin-top: 20rpx;">
        <view class="label">处方药物</view>
        <view style="font-size: 30rpx;">{{ record.prescription }}</view>
      </view>
      <view style="margin-top: 20rpx;">
        <view class="label">随访建议</view>
        <view style="font-size: 30rpx;">{{ record.followUp }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onLoad } from 'vue'
import recordsData from '@/static/mock/records.json'

const record = ref(null)

onLoad((options) => {
  const id = parseInt(options.id)
  record.value = recordsData.records.find(r => r.id === id)
})
</script>
