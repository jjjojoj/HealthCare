<template>
  <view class="app">
    <view class="content">
      <view>
        <!-- uni-app 页面容器 -->
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
@import url('./static/index.css');
</style>
