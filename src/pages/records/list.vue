<template>
  <view class="page">
    <AppHeader title="病历列表" />

    <view class="content">
      <view class="list-item" v-for="record in records" :key="record.id" @click="viewDetail(record.id)">
        <!-- 缩略图 -->
        <view class="item-thumbnail" v-if="record.images && record.images.length > 0">
          <image
            :src="record.images[0]"
            mode="aspectFill"
            class="thumbnail-img"
          />
          <view class="image-count" v-if="record.images.length > 1">
            {{ record.images.length }} 张
          </view>
        </view>

        <view class="item-content">
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

          <!-- 置信度指示器 -->
          <view class="confidence-bar">
            <view class="confidence-label">AI 置信度</view>
            <view class="confidence-value">{{ (record.image_analysis.confidence * 100).toFixed(0) }}%</view>
            <view class="confidence-progress">
              <view
                class="confidence-fill"
                :style="{ width: (record.image_analysis.confidence * 100) + '%' }"
              ></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <BottomNav />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import recordsData from '@/static/mock/records.json'

const records = ref([])

onMounted(() => {
  loadRecords()
})

// 加载病历列表（合并本地上传和 mock 数据）
const loadRecords = () => {
  let customRecords = []

  // 读取本地上传的病历
  try {
    const storedRecords = uni.getStorageSync('customRecords')
    if (storedRecords) {
      customRecords = JSON.parse(storedRecords)
    }
  } catch (e) {
    console.error('读取本地病历失败', e)
  }

  // 合并本地上传和 mock 数据（本地的排在前面）
  records.value = [...customRecords, ...recordsData.records]
}

const viewDetail = (id, isCustom) => {
  // 判断是否为用户上传的病历
  const record = records.value.find(r => r.id === id)
  const customFlag = record && record.isCustom ? '&custom=true' : ''

  uni.navigateTo({
    url: `/pages/records/detail?id=${id}${customFlag}`
  })
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
  padding: 0;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  overflow: hidden;
}

.list-item:active {
  transform: scale(0.98);
}

.item-thumbnail {
  width: 100%;
  height: 300rpx;
  position: relative;
  background: #f0f0f0;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
}

.image-count {
  position: absolute;
  bottom: 15rpx;
  right: 15rpx;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.item-content {
  padding: 30rpx;
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
  margin-bottom: 15rpx;
}

.tag {
  background: #f0f2ff;
  color: #667eea;
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

.confidence-bar {
  margin-top: 15rpx;
  padding-top: 15rpx;
  border-top: 1px solid #f0f0f0;
}

.confidence-label {
  font-size: 22rpx;
  color: #999;
  display: inline-block;
  margin-right: 10rpx;
}

.confidence-value {
  font-size: 22rpx;
  color: #667eea;
  font-weight: bold;
  display: inline-block;
}

.confidence-progress {
  width: 100%;
  height: 8rpx;
  background: #f0f0f0;
  border-radius: 4rpx;
  margin-top: 8rpx;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4rpx;
  transition: width 0.3s;
}
</style>
