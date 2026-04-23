<template>
  <view class="page">
    <AppHeader title="确认预约" :show-back="true" />

    <scroll-view scroll-y class="content">
      <!-- 预约信息 -->
      <view class="card">
        <text class="card-title">预约信息</text>
        <view class="info-row">
          <text class="info-label">就诊科室</text>
          <text class="info-value">{{ info.doc.dept }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">就诊医生</text>
          <text class="info-value">{{ info.doc.name }} {{ info.doc.title }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">就诊日期</text>
          <text class="info-value">{{ info.date }} {{ info.week }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">就诊时段</text>
          <text class="info-value">{{ info.time }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">挂号费用</text>
          <text class="info-value fee">{{ info.doc.fee }} 元</text>
        </view>
      </view>

      <!-- 患者信息 -->
      <view class="card">
        <text class="card-title">患者信息</text>
        <view class="info-row">
          <text class="info-label">姓名</text>
          <text class="info-value">张三</text>
        </view>
        <view class="info-row">
          <text class="info-label">手机号</text>
          <text class="info-value">138****8000</text>
        </view>
        <view class="info-row">
          <text class="info-label">就诊卡号</text>
          <text class="info-value">HK20251005001</text>
        </view>
      </view>

      <!-- 就诊须知 -->
      <view class="card">
        <text class="card-title">就诊须知</text>
        <view class="notice-list">
          <view class="notice-item">
            <view class="notice-dot"></view>
            <text class="notice-text">请在预约时间前 15 分钟到达候诊区</text>
          </view>
          <view class="notice-item">
            <view class="notice-dot"></view>
            <text class="notice-text">请携带身份证及就诊卡</text>
          </view>
          <view class="notice-item">
            <view class="notice-dot"></view>
            <text class="notice-text">如需取消预约，请提前 2 小时操作</text>
          </view>
          <view class="notice-item">
            <view class="notice-dot"></view>
            <text class="notice-text">演示模式：此预约仅为功能展示</text>
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="action-section">
        <view class="submit-btn" @click="submit">
          <text class="submit-btn-text">确认预约</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const info = ref({
  doc: { name: '李明华', title: '主任医师', dept: '内科', fee: 50 },
  date: '25日 4月',
  week: '周五',
  time: '08:00-08:30'
})

onLoad((query) => {
  if (query.data) {
    try {
      const data = JSON.parse(decodeURIComponent(query.data))
      info.value = data
    } catch (e) {}
  }
})

function submit() {
  uni.showModal({
    title: '预约成功',
    content: '您的预约已确认，请在就诊日前15分钟到达候诊区。',
    showCancel: false,
    success() {
      uni.navigateBack({ delta: 3 })
    }
  })
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

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 20rpx;
  display: block;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #F5F5F5;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14rpx 0;
}

.info-label {
  font-size: 26rpx;
  color: #8C8C8C;
}

.info-value {
  font-size: 26rpx;
  color: #262626;
  font-weight: 500;

  &.fee {
    color: #F5222D;
    font-weight: 600;
  }
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.notice-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #37CD87;
  margin-top: 14rpx;
  flex-shrink: 0;
}

.notice-text {
  font-size: 24rpx;
  color: #595959;
  line-height: 1.6;
}

.action-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.04);
}

.submit-btn {
  height: 96rpx;
  background: linear-gradient(135deg, #37CD87, #2DB873);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(55, 205, 135, 0.3);
}

.submit-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  letter-spacing: 4rpx;
}
</style>
