<template>
  <view class="page">
    <AppHeader title="病历列表" />

    <view class="content">
      <view class="list-item" v-for="record in records" :key="record.id" @click="viewDetail(record.id)">
        <view class="item-header">
          <view class="item-title">{{ record.title }}</view>
          <view class="item-date">{{ record.date }}</view>
        </view>
        <view class="item-summary">{{ record.summary_text }}</view>
        <view class="item-tags">
          <view v-for="tag in record.image_analysis.tags" :key="tag" class="tag">
            {{ tag }}
          </view>
        </view>
      </view>
    </view>

    <BottomNav />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import recordsData from '@/static/mock/records.json'

const records = ref(recordsData.records)

const viewDetail = (id) => {
  uni.navigateTo({ url: `/pages/records/detail?id=${id}` })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100rpx;
}

.content {
  padding: 20rpx;
}

.list-item {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.list-item:active {
  transform: scale(0.98);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15rpx;
}

.item-title {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.item-date {
  font-size: 24rpx;
  color: #999;
  margin-left: 20rpx;
}

.item-summary {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.tag {
  background: #f0f2ff;
  color: #667eea;
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}
</style>
