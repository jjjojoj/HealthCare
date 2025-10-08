<template>
  <view class="page">
    <AppHeader title="病历详情" :show-back="true" />

    <scroll-view scroll-y class="content" v-if="record">
      <!-- 图片查看器 -->
      <view class="image-gallery" v-if="record.images && record.images.length > 0">
        <swiper
          class="swiper"
          :indicator-dots="record.images.length > 1"
          :autoplay="false"
          :circular="false"
          indicator-color="rgba(255,255,255,0.5)"
          indicator-active-color="#fff"
        >
          <swiper-item v-for="(img, index) in record.images" :key="index">
            <image
              :src="img"
              mode="aspectFit"
              class="gallery-img"
              @click="previewImage(index)"
            />
          </swiper-item>
        </swiper>
        <view class="image-indicator">
          {{ currentImageIndex + 1 }} / {{ record.images.length }}
        </view>
      </view>

      <!-- 基本信息卡片 -->
      <view class="card">
        <view class="card-title">{{ record.title }}</view>
        <view class="info-row">
          <view class="info-label">检查日期</view>
          <view class="info-value">{{ record.date }}</view>
        </view>
        <view class="info-row">
          <view class="info-label">患者ID</view>
          <view class="info-value">{{ record.patient_id }}</view>
        </view>
      </view>

      <!-- 检查摘要 -->
      <view class="card">
        <view class="card-header">
          <view class="card-icon">📝</view>
          <view class="card-title-sm">检查摘要</view>
        </view>
        <view class="summary-text">{{ record.summary_text }}</view>
      </view>

      <!-- AI 图像分析结果 -->
      <view class="card analysis-card">
        <view class="card-header">
          <view class="card-icon">🤖</view>
          <view class="card-title-sm">AI 图像分析</view>
          <button class="copy-btn" size="mini" @click="copyAnalysisJSON">
            复制 JSON
          </button>
        </view>

        <!-- 分析标签 -->
        <view class="analysis-section">
          <view class="section-label">识别标签</view>
          <view class="tags-grid">
            <view
              v-for="tag in record.image_analysis.tags"
              :key="tag"
              class="analysis-tag"
            >
              {{ tag }}
            </view>
          </view>
        </view>

        <!-- 置信度 -->
        <view class="analysis-section">
          <view class="section-label">置信度</view>
          <view class="confidence-display">
            <view class="confidence-percent">
              {{ (record.image_analysis.confidence * 100).toFixed(1) }}%
            </view>
            <view class="confidence-bar-wrapper">
              <view
                class="confidence-bar-fill"
                :style="{ width: (record.image_analysis.confidence * 100) + '%' }"
              ></view>
            </view>
          </view>
        </view>

        <!-- 模型版本 -->
        <view class="analysis-section">
          <view class="section-label">模型版本</view>
          <view class="model-version">{{ record.image_analysis.model_version }}</view>
        </view>

        <!-- 分析备注 -->
        <view class="analysis-section">
          <view class="section-label">分析备注</view>
          <view class="analysis-notes">{{ record.image_analysis.notes }}</view>
        </view>
      </view>

      <!-- 关联处方 -->
      <view class="card" v-if="record.prescription_id">
        <view class="card-header">
          <view class="card-icon">💊</view>
          <view class="card-title-sm">关联处方</view>
        </view>
        <button class="action-btn" @click="viewPrescription">
          查看电子处方
        </button>
      </view>

      <!-- JSON 预览弹窗 -->
      <view class="json-modal" v-if="showJSONModal" @click="showJSONModal = false">
        <view class="json-content" @click.stop>
          <view class="json-header">
            <view class="json-title">AI 分析结果 JSON</view>
            <button class="close-btn" @click="showJSONModal = false">✕</button>
          </view>
          <scroll-view scroll-y class="json-body">
            <text class="json-text">{{ analysisJSON }}</text>
          </scroll-view>
          <view class="json-footer">
            <button class="copy-btn-large" @click="copyJSON">复制到剪贴板</button>
          </view>
        </view>
      </view>
    </scroll-view>

    <view v-else class="empty-state">
      <view class="empty-icon">📭</view>
      <view class="empty-text">未找到病历信息</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import recordsData from '@/static/mock/records.json'

const record = ref(null)
const currentImageIndex = ref(0)
const showJSONModal = ref(false)

// 格式化的 JSON 字符串
const analysisJSON = computed(() => {
  if (!record.value) return ''
  return JSON.stringify(record.value.image_analysis, null, 2)
})

onMounted(() => {
  // 从 URL 获取病历 ID 和自定义标记
  const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : []
  if (pages.length === 0) return
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || currentPage.$route?.query || {}

  const id = parseInt(options.id)
  const isCustom = options.custom === 'true'

  if (id) {
    // 如果是自定义上传的病历，从 localStorage 读取
    if (isCustom) {
      try {
        const storedRecords = uni.getStorageSync('customRecords')
        if (storedRecords) {
          const customRecords = JSON.parse(storedRecords)
          record.value = customRecords.find(r => r.id === id)
        }
      } catch (e) {
        console.error('读取本地病历失败', e)
      }
    }

    // 如果未找到或不是自定义病历，从 mock 数据读取
    if (!record.value) {
      record.value = recordsData.records.find(r => r.id === id)
    }
  }
})

// 预览图片
const previewImage = (index) => {
  if (!record.value || !record.value.images) return

  uni.previewImage({
    urls: record.value.images,
    current: index
  })
}

// 复制 JSON 到剪贴板
const copyAnalysisJSON = () => {
  showJSONModal.value = true
}

const copyJSON = () => {
  // #ifdef H5
  // H5 环境使用 Clipboard API
  if (navigator.clipboard) {
    navigator.clipboard.writeText(analysisJSON.value).then(() => {
      uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
      showJSONModal.value = false
    }).catch(() => {
      uni.showToast({ title: '复制失败', icon: 'none' })
    })
  } else {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = analysisJSON.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
    showJSONModal.value = false
  }
  // #endif

  // #ifndef H5
  // 小程序/App 环境
  uni.setClipboardData({
    data: analysisJSON.value,
    success: () => {
      uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
      showJSONModal.value = false
    }
  })
  // #endif
}

// 查看处方
const viewPrescription = () => {
  if (record.value && record.value.prescription_id) {
    uni.navigateTo({
      url: `/pages/prescription/prescription?id=${record.value.prescription_id}`
    })
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  height: calc(100vh - 88rpx);
  padding: 20rpx;
}

/* 图片查看器 */
.image-gallery {
  width: 100%;
  height: 500rpx;
  background: #000;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  position: relative;
  box-shadow: 0 8rpx 20rpx rgba(24, 144, 255, 0.15);
}

.swiper {
  width: 100%;
  height: 100%;
}

.gallery-img {
  width: 100%;
  height: 100%;
}

.image-indicator {
  position: absolute;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 6rpx 16rpx rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.06);
  transition: all 0.3s ease;
}

.card-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-icon {
  font-size: 40rpx;
  margin-right: 15rpx;
}

.card-title-sm {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 15rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #999;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.summary-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

/* AI 分析卡片 */
.analysis-card {
  background: linear-gradient(135deg, #e6f4ff 0%, #fff 100%);
  border: 2rpx solid #bae0ff;
  box-shadow: 0 6rpx 16rpx rgba(24, 144, 255, 0.15);
}

.analysis-section {
  margin-top: 25rpx;
}

.section-label {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.analysis-tag {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  color: white;
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.25);
  transition: all 0.3s ease;
}

.confidence-display {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.confidence-percent {
  font-size: 40rpx;
  font-weight: bold;
  color: #1890ff;
  min-width: 120rpx;
}

.confidence-bar-wrapper {
  flex: 1;
  height: 18rpx;
  background: #e6f4ff;
  border-radius: 9rpx;
  overflow: hidden;
  box-shadow: inset 0 2rpx 4rpx rgba(24, 144, 255, 0.1);
}

.confidence-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #0050b3 100%);
  border-radius: 9rpx;
  transition: width 0.5s ease;
  box-shadow: 0 0 12rpx rgba(24, 144, 255, 0.5);
}

.model-version {
  font-size: 26rpx;
  color: #1890ff;
  font-family: monospace;
  background: #e6f4ff;
  padding: 12rpx 18rpx;
  border-radius: 12rpx;
  display: inline-block;
  border: 1px solid #bae0ff;
}

.analysis-notes {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  background: #e6f4ff;
  padding: 18rpx 20rpx;
  border-radius: 12rpx;
  border-left: 4rpx solid #1890ff;
}

/* 按钮 */
.copy-btn {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  color: white;
  border: none;
  border-radius: 24rpx;
  padding: 10rpx 24rpx;
  font-size: 22rpx;
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

.copy-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 8rpx rgba(24, 144, 255, 0.4);
}

.action-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: bold;
  margin-top: 15rpx;
  box-shadow: 0 6rpx 16rpx rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

.action-btn:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.4);
}

/* JSON 弹窗 */
.json-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 40rpx;
}

.json-content {
  width: 100%;
  max-width: 700rpx;
  max-height: 80vh;
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.json-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #f0f0f0;
}

.json-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  font-size: 32rpx;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:active {
  background: #e0e0e0;
  transform: scale(0.95);
}

.json-body {
  flex: 1;
  padding: 30rpx;
  overflow-y: auto;
}

.json-text {
  font-family: 'Courier New', monospace;
  font-size: 24rpx;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.json-footer {
  padding: 20rpx 30rpx;
  border-top: 1px solid #f0f0f0;
}

.copy-btn-large {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: bold;
  box-shadow: 0 6rpx 16rpx rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

.copy-btn-large:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.4);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>
