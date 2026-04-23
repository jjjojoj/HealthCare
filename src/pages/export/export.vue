<template>
  <view class="page">
    <AppHeader title="数据导出" :show-back="true" />

    <scroll-view scroll-y class="content">
      <!-- 导出类型 -->
      <view class="section">
        <text class="section-title">选择导出内容</text>
        <view class="export-list">
          <view
            v-for="(item, index) in exportTypes"
            :key="index"
            class="export-card"
            :class="{ active: selectedType === index }"
            @click="selectedType = index"
          >
            <view class="export-icon" :style="{ background: item.color }">
              <text class="export-icon-text">{{ item.abbr }}</text>
            </view>
            <view class="export-info">
              <text class="export-name">{{ item.name }}</text>
              <text class="export-desc">{{ item.desc }}</text>
            </view>
            <view class="export-check" v-if="selectedType === index">
              <text class="check-text">/</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 时间范围 -->
      <view class="section">
        <text class="section-title">时间范围</text>
        <view class="card">
          <view class="date-row">
            <view class="date-picker-wrap">
              <text class="date-label">开始日期</text>
              <picker mode="date" @change="onStartChange" :value="startDate">
                <view class="date-value">
                  <text>{{ startDate }}</text>
                  <text class="picker-arrow">/</text>
                </view>
              </picker>
            </view>
            <text class="date-sep">-</text>
            <view class="date-picker-wrap">
              <text class="date-label">结束日期</text>
              <picker mode="date" @change="onEndChange" :value="endDate">
                <view class="date-value">
                  <text>{{ endDate }}</text>
                  <text class="picker-arrow">/</text>
                </view>
              </picker>
            </view>
          </view>
        </view>
      </view>

      <!-- 导出格式 -->
      <view class="section">
        <text class="section-title">导出格式</text>
        <view class="format-row">
          <view
            v-for="(fmt, index) in formats"
            :key="index"
            class="format-item"
            :class="{ active: selectedFormat === index }"
            @click="selectedFormat = index"
          >
            <text class="format-text">{{ fmt }}</text>
          </view>
        </view>
      </view>

      <!-- 导出按钮 -->
      <view class="action-section">
        <view class="export-btn" @click="doExport">
          <text class="export-btn-text">导出报告</text>
        </view>
      </view>

      <!-- 导出历史 -->
      <view class="section">
        <text class="section-title">导出历史</text>
        <view class="history-card" v-for="(item, index) in history" :key="index">
          <view class="history-left">
            <view class="history-dot"></view>
            <view class="history-info">
              <text class="history-name">{{ item.name }}</text>
              <text class="history-meta">{{ item.date }} | {{ item.format }} | {{ item.size }}</text>
            </view>
          </view>
          <view class="history-action">
            <text class="action-text" @click="reDownload(item)">重新下载</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const selectedType = ref(0)
const selectedFormat = ref(0)
const startDate = ref('2025-09-01')
const endDate = ref('2025-10-05')

const exportTypes = [
  { name: '健康报告', desc: '包含健康指标、趋势分析和建议', abbr: '健', color: 'rgba(55,205,135,0.12)' },
  { name: '病历记录', desc: '全部病历信息和AI分析结果', abbr: '病', color: 'rgba(24,144,255,0.12)' },
  { name: '用药记录', desc: '用药计划、服药记录和库存信息', abbr: '药', color: 'rgba(250,140,22,0.12)' },
  { name: '就诊记录', desc: '预约挂号和就诊历史', abbr: '诊', color: 'rgba(114,46,209,0.12)' }
]

const formats = ['PDF', 'Excel']

const history = ref([
  { name: '健康报告_2025年9月', date: '2025-10-01', format: 'PDF', size: '1.2 MB' },
  { name: '病历记录_2025年Q3', date: '2025-09-30', format: 'PDF', size: '3.5 MB' },
  { name: '用药记录_2025年9月', date: '2025-09-28', format: 'Excel', size: '0.8 MB' }
])

function onStartChange(e) { startDate.value = e.detail.value }
function onEndChange(e) { endDate.value = e.detail.value }

function doExport() {
  const item = exportTypes.value[selectedType.value]
  uni.showLoading({ title: '正在生成...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '导出成功（演示）', icon: 'success' })
  }, 1500)
}

function reDownload(item) {
  uni.showToast({ title: '开始下载（演示）', icon: 'none' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.content {
  padding: 24rpx 32rpx;
  padding-bottom: 160rpx;
}

.section {
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16rpx;
  display: block;
  padding-left: 4rpx;
}

.export-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.export-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  gap: 20rpx;
  border: 2rpx solid transparent;

  &.active {
    border-color: #37CD87;
    background: #FAFFF7;
  }
}

.export-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.export-icon-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #262626;
}

.export-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.export-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #262626;
}

.export-desc {
  font-size: 22rpx;
  color: #8C8C8C;
}

.export-check {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #37CD87;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-text {
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
}

/* 时间 */
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.date-row {
  display: flex;
  align-items: flex-end;
  gap: 16rpx;
}

.date-picker-wrap {
  flex: 1;
}

.date-label {
  font-size: 24rpx;
  color: #8C8C8C;
  margin-bottom: 8rpx;
  display: block;
}

.date-value {
  height: 72rpx;
  background: #F5F5F5;
  border-radius: 12rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 26rpx;
  color: #262626;
}

.picker-arrow {
  color: #C0C0C0;
  font-size: 24rpx;
}

.date-sep {
  font-size: 28rpx;
  color: #C0C0C0;
  padding-bottom: 16rpx;
}

/* 格式 */
.format-row {
  display: flex;
  gap: 20rpx;
}

.format-item {
  flex: 1;
  height: 80rpx;
  background: #fff;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid transparent;

  &.active {
    border-color: #37CD87;
    background: #FAFFF7;
  }
}

.format-text {
  font-size: 28rpx;
  color: #262626;
  font-weight: 500;

  .active & { color: #37CD87; }
}

/* 按钮 */
.action-section {
  margin-bottom: 32rpx;
}

.export-btn {
  height: 96rpx;
  background: linear-gradient(135deg, #37CD87, #2DB873);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(55, 205, 135, 0.3);
}

.export-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  letter-spacing: 4rpx;
}

/* 历史 */
.history-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 12rpx;
}

.history-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
  min-width: 0;
}

.history-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #37CD87;
  flex-shrink: 0;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.history-name {
  font-size: 26rpx;
  color: #262626;
  font-weight: 500;
}

.history-meta {
  font-size: 22rpx;
  color: #C0C0C0;
}

.history-action {
  flex-shrink: 0;
}

.action-text {
  font-size: 24rpx;
  color: #37CD87;
}
</style>
