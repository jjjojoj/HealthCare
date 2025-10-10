<template>
  <view class="page">
    <AppHeader title="上传病历" :show-back="true" />

    <scroll-view scroll-y class="content">
      <view class="card">
        <view class="card-title">医疗图像上传</view>
        <view class="card-subtitle">请上传检查报告、影像资料等医疗文件</view>
      </view>

      <!-- 图片上传组件 -->
      <view class="card">
        <view class="section-title">选择图片</view>
        <MediaUploader
          v-model="selectedImages"
          :max-count="5"
          @change="onImagesChange"
        />
      </view>

      <!-- 病历信息 -->
      <view class="card">
        <view class="section-title">病历信息</view>

        <view class="form-item">
          <view class="label">检查类型</view>
          <picker @change="onTypeChange" :value="typeIndex" :range="types" mode="selector">
            <view class="picker-input">
              <text>{{ types[typeIndex] }}</text>
              <text class="arrow">›</text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <view class="label">检查标题</view>
          <input
            class="input"
            v-model="title"
            placeholder="例如：皮肤过敏反应检查"
          />
        </view>

        <view class="form-item">
          <view class="label">检查描述</view>
          <textarea
            class="textarea"
            v-model="description"
            placeholder="请详细描述症状、检查过程等信息..."
            maxlength="500"
          ></textarea>
          <view class="char-count">{{ description.length }}/500</view>
        </view>
      </view>

      <!-- 上传进度 -->
      <view class="card" v-if="uploading">
        <view class="progress-container">
          <view class="progress-header">
            <view class="progress-icon">📤</view>
            <view class="progress-text">正在上传...</view>
          </view>
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: uploadProgress + '%' }"></view>
          </view>
          <view class="progress-percent">{{ uploadProgress }}%</view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button
          class="submit-btn"
          :class="{ disabled: !canSubmit || uploading }"
          :disabled="!canSubmit || uploading"
          @click="submitUpload"
        >
          {{ uploading ? '上传中...' : '提交病历' }}
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import MediaUploader from '@/components/MediaUploader.vue'

const types = ref(['皮肤检查', 'X光检查', '血液检查', '心电图', '其他检查'])
const typeIndex = ref(0)
const title = ref('')
const description = ref('')
const selectedImages = ref([])
const uploading = ref(false)
const uploadProgress = ref(0)

// 是否可以提交
const canSubmit = computed(() => {
  return selectedImages.value.length > 0 && title.value.trim() && description.value.trim()
})

const onTypeChange = (e) => {
  typeIndex.value = e.detail.value
}

const onImagesChange = (images) => {
  console.log('图片变更:', images)
}

// 模拟 AI 分析
const mockAIAnalysis = () => {
  const mockTags = {
    '皮肤检查': ['皮疹', '红斑', '接触性皮炎'],
    'X光检查': ['肺部清晰', '心影正常', '无异常'],
    '血液检查': ['白细胞升高', '轻度感染', '其他指标正常'],
    '心电图': ['窦性心律', '心率正常', '无异常'],
    '其他检查': ['检查完成', '待进一步分析']
  }

  const selectedType = types.value[typeIndex.value]
  const tags = mockTags[selectedType] || ['检查完成', '待分析']

  return {
    tags: tags,
    model_version: `ai-medical-v${(Math.random() * 3 + 1).toFixed(1)}`,
    confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
    notes: `AI自动分析结果：${selectedType}图像已处理，检测到${tags.length}个关键特征。建议结合临床症状进行综合判断。`
  }
}

// 提交上传
const submitUpload = async () => {
  if (!canSubmit.value || uploading.value) return

  uploading.value = true
  uploadProgress.value = 0

  // 模拟上传进度
  const progressInterval = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += Math.random() * 15
      if (uploadProgress.value > 90) uploadProgress.value = 90
    }
  }, 200)

  // 模拟上传延迟
  await new Promise(resolve => setTimeout(resolve, 2000))

  uploadProgress.value = 100

  setTimeout(async () => {
    clearInterval(progressInterval)

    // 获取现有病历记录
    let existingRecords = []
    try {
      const storedRecords = uni.getStorageSync('customRecords')
      if (storedRecords) {
        existingRecords = JSON.parse(storedRecords)
      }
    } catch (e) {
      console.error('读取本地记录失败', e)
    }

    // 生成新的病历 ID
    const newId = existingRecords.length > 0
      ? Math.max(...existingRecords.map(r => r.id)) + 1
      : 1000

    // 创建新病历记录
    const newRecord = {
      id: newId,
      patient_id: 1,
      title: title.value,
      date: new Date().toISOString().split('T')[0],
      images: selectedImages.value.map(img => img.url),
      summary_text: description.value,
      image_analysis: mockAIAnalysis(),
      prescription_id: null,
      isCustom: true, // 标记为用户上传
      uploadTime: new Date().toISOString()
    }

    // 保存到本地存储
    existingRecords.unshift(newRecord) // 添加到列表开头
    try {
      uni.setStorageSync('customRecords', JSON.stringify(existingRecords))
      console.log('新病历已保存:', newRecord)
    } catch (e) {
      console.error('保存失败', e)
      uni.showToast({
        title: '保存失败，请重试',
        icon: 'none'
      })
      uploading.value = false
      return
    }

    uploading.value = false

    // 显示成功提示
    uni.showToast({
      title: '上传成功',
      icon: 'success'
    })

    // 跳转到新创建的病历详情页
    setTimeout(() => {
      uni.redirectTo({
        url: `/pages/records/detail?id=${newId}&custom=true`
      })
    }, 1000)
  }, 500)
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
  padding-bottom: 120rpx;
}

.card {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.card-subtitle {
  font-size: 24rpx;
  color: #999;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 15rpx;
  font-weight: 500;
}

.picker-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  padding: 0 30rpx;
  background: #f8f9ff;
  border: 2rpx solid #e8eaff;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333;
}

.arrow {
  font-size: 40rpx;
  color: #999;
  transform: rotate(90deg);
}

.input {
  width: 100%;
  height: 80rpx;
  padding: 0 30rpx;
  background: #f8f9ff;
  border: 2rpx solid #e8eaff;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx 30rpx;
  background: #f8f9ff;
  border: 2rpx solid #e8eaff;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  line-height: 1.6;
}

.char-count {
  text-align: right;
  font-size: 22rpx;
  color: #999;
  margin-top: 10rpx;
}

/* 上传进度 */
.progress-container {
  padding: 20rpx 0;
}

.progress-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.progress-icon {
  font-size: 48rpx;
  margin-right: 15rpx;
}

.progress-text {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}

.progress-bar {
  width: 100%;
  height: 16rpx;
  background: #e8eaff;
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #37CD87 0%, #2DB873 100%);
  border-radius: 8rpx;
  transition: width 0.3s;
}

.progress-percent {
  text-align: center;
  font-size: 24rpx;
  color: #37CD87;
  font-weight: bold;
}

/* 提交按钮 */
.submit-section {
  padding: 30rpx 0;
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  background: linear-gradient(135deg, #37CD87 0%, #2DB873 100%);
  color: white;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  box-shadow: 0 8rpx 20rpx rgba(55, 205, 135, 0.3);
}

.submit-btn.disabled {
  background: #ccc;
  box-shadow: none;
}
</style>
