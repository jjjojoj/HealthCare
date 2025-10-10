<template>
  <view class="page">
    <AppHeader title="病历管理" />

    <view class="content">
      <!-- 顶部统计卡片 -->
      <view class="stats-container">
        <view class="stat-card">
          <view class="stat-gradient stat-gradient-primary"></view>
          <view class="stat-content">
            <text class="stat-icon">📊</text>
            <view class="stat-info">
              <text class="stat-value">{{ totalRecords }}</text>
              <text class="stat-label">总病历</text>
            </view>
          </view>
        </view>
        <view class="stat-card">
          <view class="stat-gradient stat-gradient-success"></view>
          <view class="stat-content">
            <text class="stat-icon">📈</text>
            <view class="stat-info">
              <text class="stat-value">{{ monthlyRecords }}</text>
              <text class="stat-label">本月新增</text>
            </view>
          </view>
        </view>
        <view class="stat-card">
          <view class="stat-gradient stat-gradient-warning"></view>
          <view class="stat-content">
            <text class="stat-icon">⏰</text>
            <view class="stat-info">
              <text class="stat-value">{{ pendingRecords }}</text>
              <text class="stat-label">待处理</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 筛选和排序栏 -->
      <view class="filter-bar">
        <view class="filter-tabs">
          <view
            v-for="(tab, index) in filterTabs"
            :key="index"
            class="filter-tab"
            :class="{ 'filter-tab-active': currentTab === index }"
            @click="switchTab(index)"
          >
            {{ tab }}
          </view>
        </view>
        <view class="sort-btn" @click="toggleSort">
          <text class="sort-icon">{{ sortAsc ? '↑' : '↓' }}</text>
        </view>
      </view>

      <!-- 病历列表 -->
      <view class="list-container" v-if="filteredRecords.length > 0">
        <view class="record-card" v-for="record in filteredRecords" :key="record.id" @click="viewDetail(record.id)">
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="record-title-row">
              <text class="record-title">{{ record.title }}</text>
              <view class="status-badge" :class="'status-' + getRecordStatus(record)">
                <text>{{ getRecordStatusText(record) }}</text>
              </view>
            </view>
            <view class="record-date">
              <text class="date-icon">📅</text>
              <text class="date-text">{{ record.date }}</text>
            </view>
          </view>

          <!-- 图片预览 -->
          <view class="card-images" v-if="record.images && record.images.length > 0">
            <image
              v-for="(img, idx) in record.images.slice(0, 3)"
              :key="idx"
              :src="img"
              mode="aspectFill"
              class="preview-image"
            />
            <view class="more-images" v-if="record.images.length > 3">
              <text>+{{ record.images.length - 3 }}</text>
            </view>
          </view>

          <!-- 病历摘要 -->
          <view class="card-summary">
            <text class="summary-text">{{ record.summary_text }}</text>
          </view>

          <!-- 标签 -->
          <view class="card-tags">
            <view
              v-for="(tag, idx) in record.image_analysis.tags.slice(0, 4)"
              :key="tag"
              class="tag"
              :class="'tag-color-' + (idx % 6)"
            >
              {{ tag }}
            </view>
            <view v-if="record.image_analysis.tags.length > 4" class="tag tag-more">
              +{{ record.image_analysis.tags.length - 4 }}
            </view>
          </view>

          <!-- 底部信息栏 -->
          <view class="card-footer">
            <view class="confidence-info">
              <text class="confidence-icon">🤖</text>
              <text class="confidence-text">AI 置信度 {{ (record.image_analysis.confidence * 100).toFixed(0) }}%</text>
            </view>
            <view class="card-actions">
              <text class="action-link">查看详情 →</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <view class="empty-icon">📋</view>
        <text class="empty-title">暂无病历记录</text>
        <text class="empty-desc">开始上传您的第一份病历吧</text>
        <view class="empty-btn" @click="goToUpload">
          <text class="btn-icon">➕</text>
          <text>立即上传</text>
        </view>
      </view>
    </view>

    <BottomNav />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
import recordsData from '@/static/mock/records.json'

const records = ref([])
const currentTab = ref(0)
const currentSort = ref(0)
const sortAsc = ref(false)

const filterTabs = ['全部', '已分析', '待处理', '本月']
const sortOptions = ['按日期', '按置信度']

onMounted(() => {
  loadRecords()
})

// 统计数据
const totalRecords = computed(() => records.value.length)

const monthlyRecords = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return records.value.filter(record => {
    const recordDate = new Date(record.date)
    return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
  }).length
})

const pendingRecords = computed(() => {
  return records.value.filter(record => !record.image_analysis || record.image_analysis.confidence < 0.7).length
})

// 过滤和排序后的病历列表
const filteredRecords = computed(() => {
  let filtered = [...records.value]

  // 按选项卡筛选
  if (currentTab.value === 1) {
    filtered = filtered.filter(r => r.image_analysis && r.image_analysis.confidence >= 0.7)
  } else if (currentTab.value === 2) {
    filtered = filtered.filter(r => !r.image_analysis || r.image_analysis.confidence < 0.7)
  } else if (currentTab.value === 3) {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    filtered = filtered.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear
    })
  }

  // 排序
  if (currentSort.value === 0) {
    filtered.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return sortAsc.value ? dateA - dateB : dateB - dateA
    })
  } else if (currentSort.value === 1) {
    filtered.sort((a, b) => {
      const confA = a.image_analysis?.confidence || 0
      const confB = b.image_analysis?.confidence || 0
      return sortAsc.value ? confA - confB : confB - confA
    })
  }

  return filtered
})

// 加载病历列表
const loadRecords = () => {
  let customRecords = []

  try {
    const storedRecords = uni.getStorageSync('customRecords')
    if (storedRecords) {
      customRecords = JSON.parse(storedRecords)
    }
  } catch (e) {
    console.error('读取本地病历失败', e)
  }

  records.value = [...customRecords, ...recordsData.records]
}

// 切换选项卡
const switchTab = (index) => {
  currentTab.value = index
}

// 切换排序
const toggleSort = () => {
  if (sortAsc.value) {
    currentSort.value = (currentSort.value + 1) % sortOptions.length
    sortAsc.value = false
  } else {
    sortAsc.value = true
  }
}

// 获取病历状态
const getRecordStatus = (record) => {
  if (!record.image_analysis) return 'pending'
  const confidence = record.image_analysis.confidence
  if (confidence >= 0.9) return 'excellent'
  if (confidence >= 0.7) return 'good'
  return 'pending'
}

const getRecordStatusText = (record) => {
  const status = getRecordStatus(record)
  const statusMap = {
    'excellent': '已分析',
    'good': '已分析',
    'pending': '待处理'
  }
  return statusMap[status] || '未知'
}

// 查看详情
const viewDetail = (id) => {
  const record = records.value.find(r => r.id === id)
  const customFlag = record && record.isCustom ? '&custom=true' : ''

  uni.navigateTo({
    url: `/pages/records/detail?id=${id}${customFlag}`
  })
}

// 前往上传页面
const goToUpload = () => {
  uni.navigateTo({
    url: '/pages/upload/upload'
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F4F8 0%, #FAFBFC 100%);
  padding-bottom: 120rpx;
}

.content {
  padding: 24rpx 32rpx;
}

/* ========== 统计卡片 ========== */
.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.stat-card {
  position: relative;
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.stat-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.08;
  z-index: 0;
}

.stat-gradient-primary {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
}

.stat-gradient-success {
  background: linear-gradient(135deg, #5FD068 0%, #3EBD5B 100%);
}

.stat-gradient-warning {
  background: linear-gradient(135deg, #FFB84D 0%, #FF9F1A 100%);
}

.stat-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28rpx 16rpx;
  gap: 12rpx;
}

.stat-icon {
  font-size: 40rpx;
}

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 800;
  color: #2C3E50;
  line-height: 1;
}

.stat-label {
  font-size: 22rpx;
  color: #7F8C8D;
  font-weight: 500;
}

/* ========== 筛选栏 ========== */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.filter-tabs {
  flex: 1;
  display: flex;
  background: white;
  border-radius: 16rpx;
  padding: 8rpx;
  gap: 8rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.filter-tab {
  flex: 1;
  padding: 12rpx 16rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
  color: #7F8C8D;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-tab-active {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
  color: white;
  font-weight: 700;
  box-shadow: 0 4rpx 12rpx rgba(78, 205, 196, 0.25);
}

.sort-btn {
  width: 72rpx;
  height: 72rpx;
  background: white;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sort-btn:active {
  transform: scale(0.95);
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(68, 168, 242, 0.1) 100%);
}

.sort-icon {
  font-size: 32rpx;
  color: #4A90E2;
  font-weight: 700;
}

/* ========== 病历卡片列表 ========== */
.list-container {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-card {
  background: white;
  border-radius: 24rpx;
  padding: 28rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  border: 1rpx solid #F0F3F7;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.record-card:active {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 32rpx rgba(78, 205, 196, 0.15);
  border-color: #4ECDC4;
}

/* 卡片头部 */
.card-header {
  margin-bottom: 20rpx;
}

.record-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12rpx;
}

.record-title {
  flex: 1;
  font-size: 30rpx;
  font-weight: 700;
  color: #2C3E50;
  line-height: 1.4;
  margin-right: 16rpx;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 700;
  white-space: nowrap;
}

.status-excellent {
  background: linear-gradient(135deg, #5FD068 0%, #3EBD5B 100%);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(95, 208, 104, 0.25);
}

.status-good {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(78, 205, 196, 0.25);
}

.status-pending {
  background: linear-gradient(135deg, #FFB84D 0%, #FF9F1A 100%);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(255, 184, 77, 0.25);
}

.record-date {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.date-icon {
  font-size: 24rpx;
}

.date-text {
  font-size: 24rpx;
  color: #BDC3C7;
}

/* 图片预览 */
.card-images {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.preview-image {
  flex: 1;
  height: 180rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #F0F3F7 0%, #E1E8ED 100%);
}

.more-images {
  flex: 1;
  height: 180rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(68, 168, 242, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  color: #4A90E2;
}

/* 病历摘要 */
.card-summary {
  margin-bottom: 20rpx;
}

.summary-text {
  font-size: 26rpx;
  color: #7F8C8D;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 标签 */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.tag {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: white;
}

.tag-color-0 {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
}

.tag-color-1 {
  background: linear-gradient(135deg, #5FD068 0%, #3EBD5B 100%);
}

.tag-color-2 {
  background: linear-gradient(135deg, #8B7FD6 0%, #B794F6 100%);
}

.tag-color-3 {
  background: linear-gradient(135deg, #F48FB1 0%, #EC407A 100%);
}

.tag-color-4 {
  background: linear-gradient(135deg, #FFB84D 0%, #FF9F1A 100%);
}

.tag-color-5 {
  background: linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%);
}

.tag-more {
  background: linear-gradient(135deg, #BDC3C7 0%, #95A5A6 100%);
}

/* 底部信息栏 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #F0F3F7;
}

.confidence-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.confidence-icon {
  font-size: 24rpx;
}

.confidence-text {
  font-size: 22rpx;
  color: #7F8C8D;
  font-weight: 500;
}

.card-actions {
  display: flex;
  align-items: center;
}

.action-link {
  font-size: 24rpx;
  color: #4A90E2;
  font-weight: 600;
}

/* ========== 空状态 ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
  background: white;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 32rpx;
  opacity: 0.5;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #BDC3C7;
  margin-bottom: 48rpx;
  text-align: center;
}

.empty-btn {
  padding: 20rpx 48rpx;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  box-shadow: 0 8rpx 24rpx rgba(78, 205, 196, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.empty-btn:active {
  transform: translateY(-4rpx);
  box-shadow: 0 12rpx 32rpx rgba(78, 205, 196, 0.4);
}

.btn-icon {
  font-size: 28rpx;
  color: white;
}

.empty-btn text:last-child {
  font-size: 28rpx;
  color: white;
  font-weight: 700;
}
</style>
