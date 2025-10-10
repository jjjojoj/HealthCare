<template>
  <view class="media-uploader">
    <!-- 图片预览区 -->
    <view class="preview-area" v-if="imageList.length > 0">
      <view class="preview-grid">
        <view
          v-for="(img, index) in imageList"
          :key="index"
          class="preview-item"
        >
          <image :src="img.url" mode="aspectFill" class="preview-img" />
          <view class="delete-btn" @click="removeImage(index)">
            <text class="delete-icon">×</text>
          </view>
        </view>

        <!-- 添加更多按钮 -->
        <view
          v-if="imageList.length < maxCount"
          class="add-more"
          @click="chooseImages"
        >
          <text class="add-icon">+</text>
          <text class="add-text">添加图片</text>
        </view>
      </view>

      <view class="image-count">
        {{ imageList.length }} / {{ maxCount }} 张
      </view>
    </view>

    <!-- 空状态 - 首次上传 -->
    <view v-else class="empty-state" @click="chooseImages">
      <view class="upload-icon">📷</view>
      <view class="upload-text">点击选择图片</view>
      <view class="upload-hint">支持选择 {{ maxCount }} 张图片</view>
    </view>

    <!-- 上传提示 -->
    <view class="upload-tips">
      <text class="tip-text">• 支持 JPG、PNG 格式</text>
      <text class="tip-text">• 单张图片不超过 10MB</text>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  maxCount: {
    type: Number,
    default: 9
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const imageList = ref([])

// 监听外部传入的值
watch(() => props.modelValue, (newVal) => {
  imageList.value = newVal
}, { immediate: true })

// 选择图片
const chooseImages = () => {
  const remainCount = props.maxCount - imageList.value.length

  uni.chooseImage({
    count: remainCount,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFiles = res.tempFiles || []
      const newImages = tempFiles.map((file, index) => ({
        url: file.path || res.tempFilePaths[index],
        size: file.size || 0,
        name: `image_${Date.now()}_${index}.jpg`
      }))

      imageList.value = [...imageList.value, ...newImages]
      emit('update:modelValue', imageList.value)
      emit('change', imageList.value)
    },
    fail: (err) => {
      console.error('选择图片失败', err)
      uni.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  })
}

// 删除图片
const removeImage = (index) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除这张图片吗？',
    success: (res) => {
      if (res.confirm) {
        imageList.value.splice(index, 1)
        emit('update:modelValue', imageList.value)
        emit('change', imageList.value)
      }
    }
  })
}
</script>

<style scoped>
.media-uploader {
  width: 100%;
}

/* 预览区域 */
.preview-area {
  width: 100%;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15rpx;
}

.preview-item {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background: #f5f5f5;
  border-radius: 12rpx;
  overflow: hidden;
}

.preview-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 48rpx;
  height: 48rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  color: white;
  font-size: 40rpx;
  line-height: 1;
}

.add-more {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background: #f8f9ff;
  border: 2rpx dashed #37CD87;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.add-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  font-size: 60rpx;
  color: #37CD87;
  line-height: 1;
}

.add-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 30%);
  font-size: 22rpx;
  color: #37CD87;
}

.image-count {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 15rpx;
}

/* 空状态 */
.empty-state {
  width: 100%;
  height: 400rpx;
  background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
  border: 2rpx dashed #37CD87;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.empty-state:active {
  transform: scale(0.98);
  background: #f0f2ff;
}

.upload-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.upload-text {
  font-size: 32rpx;
  color: #37CD87;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.upload-hint {
  font-size: 24rpx;
  color: #999;
}

/* 上传提示 */
.upload-tips {
  margin-top: 20rpx;
  padding: 20rpx;
  background: #f8f9ff;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
}
</style>
