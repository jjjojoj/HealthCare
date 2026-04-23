<template>
  <view class="page">
    <AppHeader title="设置" :show-back="true" />

    <scroll-view scroll-y class="content">
      <!-- 通知偏好 -->
      <view class="section">
        <view class="section-title">通知偏好</view>
        <view class="card">
          <view class="setting-item" v-for="(item, index) in notifySettings" :key="index">
            <view class="setting-left">
              <text class="setting-label">{{ item.label }}</text>
              <text class="setting-desc">{{ item.desc }}</text>
            </view>
            <switch :checked="item.value" @change="item.value = !item.value" color="#37CD87" />
          </view>
        </view>
      </view>

      <!-- 隐私设置 -->
      <view class="section">
        <view class="section-title">隐私设置</view>
        <view class="card">
          <view class="setting-item" v-for="(item, index) in privacySettings" :key="index">
            <view class="setting-left">
              <text class="setting-label">{{ item.label }}</text>
            </view>
            <switch :checked="item.value" @change="item.value = !item.value" color="#37CD87" />
          </view>
        </view>
      </view>

      <!-- 通用设置 -->
      <view class="section">
        <view class="section-title">通用</view>
        <view class="card">
          <view class="setting-row" @click="clearCache">
            <text class="setting-label">清除缓存</text>
            <view class="setting-right">
              <text class="setting-value">{{ cacheSize }}</text>
              <text class="setting-arrow">/</text>
            </view>
          </view>
          <view class="setting-row">
            <text class="setting-label">当前版本</text>
            <view class="setting-right">
              <text class="setting-value">v1.2.0</text>
            </view>
          </view>
          <view class="setting-row" @click="checkUpdate">
            <text class="setting-label">检查更新</text>
            <view class="setting-right">
              <text class="setting-arrow">/</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 关于 -->
      <view class="section">
        <view class="section-title">关于</view>
        <view class="card">
          <view class="setting-row" @click="showAbout = true">
            <text class="setting-label">关于我们</text>
            <view class="setting-right">
              <text class="setting-arrow">/</text>
            </view>
          </view>
          <view class="setting-row">
            <text class="setting-label">隐私政策</text>
            <view class="setting-right">
              <text class="setting-arrow">/</text>
            </view>
          </view>
          <view class="setting-row">
            <text class="setting-label">用户协议</text>
            <view class="setting-right">
              <text class="setting-arrow">/</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="section">
        <view class="logout-btn" @click="logout">
          <text class="logout-text">退出登录</text>
        </view>
      </view>

      <!-- 关于弹窗 -->
      <view class="modal-mask" v-if="showAbout" @click="showAbout = false">
        <view class="modal-content" @click.stop>
          <view class="modal-header-bar"></view>
          <text class="modal-title">健康管理中心</text>
          <text class="modal-version">v1.2.0</text>
          <text class="modal-desc">一款集健康档案管理、智能病历分析、在线问诊咨询于一体的综合健康管理平台。</text>
          <text class="modal-desc">演示版本，仅供体验。</text>
          <view class="modal-close" @click="showAbout = false">
            <text class="modal-close-text">关闭</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const showAbout = ref(false)
const cacheSize = ref('2.3 MB')

const notifySettings = ref([
  { label: '用药提醒', desc: '到服药时间时推送通知', value: true },
  { label: '复查提醒', desc: '复查预约前一天推送通知', value: true },
  { label: '系统消息', desc: '系统更新和公告通知', value: false }
])

const privacySettings = ref([
  { label: '允许数据用于改进服务', value: false },
  { label: '允许匿名使用统计', value: true }
])

function clearCache() {
  uni.showModal({
    title: '确认清除',
    content: '清除缓存不会影响您的个人数据',
    success(res) {
      if (res.confirm) {
        cacheSize.value = '0 MB'
        uni.showToast({ title: '缓存已清除', icon: 'success' })
      }
    }
  })
}

function checkUpdate() {
  uni.showToast({ title: '已是最新版本', icon: 'none' })
}

function logout() {
  uni.showModal({
    title: '确认退出',
    content: '退出后需要重新登录',
    success(res) {
      if (res.confirm) {
        uni.removeStorageSync('healthcare_token')
        uni.removeStorageSync('healthcare_userInfo')
        uni.reLaunch({ url: '/pages/login/login' })
      }
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
  padding-bottom: 80rpx;
}

.section {
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 26rpx;
  color: #8C8C8C;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx;
  border-bottom: 1rpx solid #F5F5F5;

  &:last-child { border-bottom: none; }
}

.setting-left {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  flex: 1;
  margin-right: 20rpx;
}

.setting-label {
  font-size: 28rpx;
  color: #262626;
}

.setting-desc {
  font-size: 24rpx;
  color: #C0C0C0;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx;
  border-bottom: 1rpx solid #F5F5F5;

  &:last-child { border-bottom: none; }
}

.setting-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.setting-value {
  font-size: 26rpx;
  color: #C0C0C0;
}

.setting-arrow {
  font-size: 24rpx;
  color: #C0C0C0;
}

.logout-btn {
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx;
}

.logout-text {
  font-size: 30rpx;
  color: #F5222D;
  font-weight: 500;
}

/* 弹窗 */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 560rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-header-bar {
  width: 64rpx;
  height: 8rpx;
  background: #37CD87;
  border-radius: 4rpx;
  margin-bottom: 28rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #262626;
  margin-bottom: 8rpx;
}

.modal-version {
  font-size: 26rpx;
  color: #C0C0C0;
  margin-bottom: 28rpx;
}

.modal-desc {
  font-size: 26rpx;
  color: #595959;
  text-align: center;
  line-height: 1.8;
  margin-bottom: 8rpx;
}

.modal-close {
  width: 100%;
  height: 80rpx;
  background: #F5F5F5;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 28rpx;
}

.modal-close-text {
  font-size: 28rpx;
  color: #595959;
}
</style>
