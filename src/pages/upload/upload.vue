<template>
  <view class="container">
    <view class="card">
      <view class="title">上传医疗文件</view>
      <view style="margin-top: 30rpx;">
        <view class="label">文件类型</view>
        <picker @change="onTypeChange" :value="typeIndex" :range="types">
          <view class="input">{{ types[typeIndex] }}</view>
        </picker>
      </view>
      <view style="margin-top: 30rpx;">
        <view class="label">文件描述</view>
        <textarea class="input" v-model="description" placeholder="请输入文件描述" style="height: 150rpx;"></textarea>
      </view>
      <button class="btn" style="margin-top: 30rpx;" @click="chooseFile">选择文件</button>
      <view v-if="fileName" style="margin-top: 20rpx; color: #666; font-size: 28rpx;">
        已选择: {{ fileName }}
      </view>
      <button class="btn btn-secondary" style="margin-top: 30rpx;" @click="upload" :disabled="!fileName">上传</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const types = ref(['检查报告', '影像资料', '处方单', '其他'])
const typeIndex = ref(0)
const description = ref('')
const fileName = ref('')

const onTypeChange = (e) => {
  typeIndex.value = e.detail.value
}

const chooseFile = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      fileName.value = res.tempFilePaths[0].split('/').pop()
    }
  })
}

const upload = () => {
  uni.showLoading({ title: '上传中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '上传成功', icon: 'success' })
    typeIndex.value = 0
    description.value = ''
    fileName.value = ''
  }, 1500)
}
</script>
