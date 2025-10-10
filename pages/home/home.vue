<template>
  <view class="page">
    <!-- 顶部用户信息卡片 -->
    <view class="hero-section">
      <view class="hero-bg"></view>
      <view class="hero-content">
        <view class="user-greeting">
          <view class="avatar-wrapper">
            <image
              class="avatar"
              :src="userAvatar"
              mode="aspectFill"
              @error="handleAvatarError"
            />
            <view class="online-badge"></view>
          </view>
          <view class="greeting-text">
            <text class="greeting-time">{{ greetingTime }}</text>
            <text class="user-name">{{ userName }}</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="action-icon" @click="handleNotification">
            <text class="icon">🔔</text>
            <view class="badge" v-if="notificationCount > 0">{{ notificationCount }}</view>
          </view>
        </view>
      </view>

      <!-- 健康评分卡片 -->
      <view class="health-score-card">
        <view class="score-circle">
          <view class="score-ring">
            <text class="score-value">{{ healthScore }}</text>
            <text class="score-unit">/100</text>
          </view>
          <text class="score-label">健康评分</text>
        </view>
        <view class="score-insights">
          <view class="insight-item" v-for="(insight, idx) in healthInsights" :key="idx">
            <view class="insight-icon" :class="'insight-' + insight.type">
              <text>{{ insight.icon }}</text>
            </view>
            <text class="insight-text">{{ insight.text }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 健康趋势 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">健康趋势</text>
          <text class="section-link" @click="navigateTo('/pages/trends/trends')">查看详情 →</text>
        </view>
        <view class="trends-card">
          <view class="trends-tabs">
            <view
              v-for="(tab, idx) in trendsTabs"
              :key="idx"
              class="trends-tab"
              :class="{ 'trends-tab-active': currentTrendTab === idx }"
              @click="currentTrendTab = idx"
            >
              {{ tab }}
            </view>
          </view>
          <view class="trends-chart">
            <view class="chart-placeholder">
              <text class="chart-icon">📊</text>
              <text class="chart-text">7日健康数据趋势图</text>
            </view>
          </view>
          <view class="trends-summary">
            <view class="summary-item">
              <text class="summary-label">平均值</text>
              <text class="summary-value">{{ trendsSummary.avg }}</text>
            </view>
            <view class="summary-item">
              <text class="summary-label">最高值</text>
              <text class="summary-value">{{ trendsSummary.max }}</text>
            </view>
            <view class="summary-item">
              <text class="summary-label">最低值</text>
              <text class="summary-value">{{ trendsSummary.min }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- AI 健康建议 -->
      <view class="section">
        <view class="ai-suggestion-card">
          <view class="ai-header">
            <view class="ai-icon">🤖</view>
            <view class="ai-title">
              <text class="ai-label">AI 健康助手</text>
              <text class="ai-subtitle">基于您的数据分析</text>
            </view>
          </view>
          <view class="ai-content">
            <text class="ai-text">{{ aiSuggestion }}</text>
          </view>
          <view class="ai-actions">
            <view class="ai-action-btn" @click="handleAISuggestion">
              <text>了解更多</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 快捷服务 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">快捷服务</text>
        </view>
        <view class="service-grid">
          <view
            class="service-card"
            v-for="(service, index) in services"
            :key="index"
            @click="navigateTo(service.path)"
          >
            <view class="service-icon-bg" :class="'service-bg-' + index">
              <text class="service-icon">{{ service.icon }}</text>
            </view>
            <text class="service-name">{{ service.name }}</text>
            <text class="service-desc">{{ service.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 最近活动 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">最近活动</text>
          <text class="section-link" @click="navigateTo('/pages/records/list')">全部记录 →</text>
        </view>
        <view class="activity-list">
          <view
            class="activity-item"
            v-for="(activity, index) in recentActivities"
            :key="index"
            @click="handleActivityClick(activity)"
          >
            <view class="activity-icon" :class="'activity-type-' + activity.type">
              <text>{{ activity.icon }}</text>
            </view>
            <view class="activity-content">
              <text class="activity-title">{{ activity.title }}</text>
              <text class="activity-time">{{ activity.time }}</text>
            </view>
            <view class="activity-arrow">→</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <BottomNav />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'

// 用户信息
const userName = ref('用户')
const userAvatar = ref('/static/mock/images/avatar.jpg')
const notificationCount = ref(3)

// 健康评分
const healthScore = ref(85)
const healthInsights = ref([
  { icon: '💓', text: '心率正常', type: 'good' },
  { icon: '🏃', text: '运动充足', type: 'good' },
  { icon: '😴', text: '睡眠略少', type: 'warning' }
])

// 健康趋势
const currentTrendTab = ref(0)
const trendsTabs = ref(['步数', '心率', '血压', '睡眠'])
const trendsSummary = ref({
  avg: '8,234',
  max: '12,543',
  min: '5,621'
})

// AI 建议
const aiSuggestion = ref('根据您最近一周的数据,建议增加30分钟有氧运动,并保持每晚7-8小时睡眠以优化健康状况。')

// 快捷服务
const services = ref([
  { icon: '📋', name: '病历管理', desc: '查看记录', path: '/pages/records/list' },
  { icon: '💬', name: 'AI咨询', desc: '智能问答', path: '/pages/chatbot/chat' },
  { icon: '📤', name: '上传报告', desc: '新增记录', path: '/pages/upload/upload' },
  { icon: '💊', name: '用药助手', desc: '提醒管理', path: '/pages/meds/meds' },
  { icon: '📊', name: '健康趋势', desc: '数据分析', path: '/pages/trends/trends' },
  { icon: '🚨', name: '紧急联系', desc: '快速求助', path: '/pages/emergency/emergency' }
])

// 最近活动
const recentActivities = ref([
  { icon: '📋', title: '上传了血常规检查报告', time: '2小时前', type: 'upload' },
  { icon: '💊', title: '完成今日用药提醒', time: '5小时前', type: 'medication' },
  { icon: '💬', title: 'AI咨询了健康问题', time: '1天前', type: 'chat' }
])

// 问候语
const greetingTime = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了'
})

onMounted(() => {
  // 检查登录状态
  const isLogin = uni.getStorageSync('isLogin')
  if (!isLogin) {
    uni.reLaunch({ url: '/pages/login/login' })
    return
  }

  // 获取用户信息
  try {
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo && userInfo.name) {
      userName.value = userInfo.name
    }
  } catch (e) {
    console.error('获取用户信息失败', e)
  }
})

const handleAvatarError = () => {
  userAvatar.value = ''
}

const handleNotification = () => {
  uni.navigateTo({ url: '/pages/notifications/notifications' })
}

const handleAISuggestion = () => {
  uni.navigateTo({ url: '/pages/chatbot/chat' })
}

const handleActivityClick = (activity) => {
  if (activity.type === 'upload') {
    uni.navigateTo({ url: '/pages/records/list' })
  } else if (activity.type === 'chat') {
    uni.navigateTo({ url: '/pages/chatbot/chat' })
  } else if (activity.type === 'medication') {
    uni.navigateTo({ url: '/pages/meds/meds' })
  }
}

const navigateTo = (url) => {
  uni.navigateTo({ url })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F4F8 0%, #FAFBFC 100%);
  padding-bottom: 120rpx;
}

/* ========== 顶部 Hero 区域 ========== */
.hero-section {
  position: relative;
  padding: 40rpx 32rpx 32rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
  border-radius: 0 0 48rpx 48rpx;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32rpx;
}

.user-greeting {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar-wrapper {
  position: relative;
  width: 96rpx;
  height: 96rpx;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
  background: white;
}

.online-badge {
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
  width: 20rpx;
  height: 20rpx;
  background: #5FD068;
  border-radius: 50%;
  border: 3rpx solid white;
}

.greeting-text {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.greeting-time {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.user-name {
  font-size: 40rpx;
  color: white;
  font-weight: 700;
  line-height: 1.2;
}

.header-actions {
  display: flex;
  gap: 16rpx;
}

.action-icon {
  position: relative;
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20rpx);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
}

.action-icon .icon {
  font-size: 32rpx;
}

.badge {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  background: #FF6B6B;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: white;
  font-weight: 700;
  border: 2rpx solid white;
}

/* 健康评分卡片 */
.health-score-card {
  position: relative;
  z-index: 1;
  background: white;
  border-radius: 32rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.score-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.score-ring {
  position: relative;
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: 0 8rpx 24rpx rgba(78, 205, 196, 0.3);
}

.score-ring::before {
  content: '';
  position: absolute;
  inset: 8rpx;
  background: white;
  border-radius: 50%;
  z-index: 0;
}

.score-value {
  position: relative;
  z-index: 1;
  font-size: 52rpx;
  font-weight: 800;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.score-unit {
  position: relative;
  z-index: 1;
  font-size: 20rpx;
  color: #7F8C8D;
  font-weight: 600;
}

.score-label {
  font-size: 24rpx;
  color: #7F8C8D;
  font-weight: 500;
}

.score-insights {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.insight-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.insight-good {
  background: linear-gradient(135deg, #5FD068 0%, #3EBD5B 100%);
}

.insight-warning {
  background: linear-gradient(135deg, #FFB84D 0%, #FF9F1A 100%);
}

.insight-text {
  font-size: 26rpx;
  color: #2C3E50;
  font-weight: 500;
}

/* ========== 主要内容区域 ========== */
.main-content {
  padding: 0 32rpx;
}

.section {
  margin-bottom: 40rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  color: #2C3E50;
  font-weight: 700;
}

.section-link {
  font-size: 24rpx;
  color: #4A90E2;
  font-weight: 500;
}

/* 健康趋势卡片 */
.trends-card {
  background: white;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  border: 1rpx solid #F0F3F7;
}

.trends-tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 24rpx;
  padding: 8rpx;
  background: #F8FAFC;
  border-radius: 16rpx;
}

.trends-tab {
  flex: 1;
  padding: 12rpx 16rpx;
  text-align: center;
  font-size: 24rpx;
  color: #7F8C8D;
  font-weight: 500;
  border-radius: 12rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.trends-tab-active {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
  color: white;
  font-weight: 700;
  box-shadow: 0 4rpx 12rpx rgba(78, 205, 196, 0.25);
}

.trends-chart {
  margin-bottom: 24rpx;
  padding: 48rpx 32rpx;
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.05) 0%, rgba(68, 168, 242, 0.05) 100%);
  border-radius: 16rpx;
  border: 2rpx dashed rgba(78, 205, 196, 0.3);
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.chart-icon {
  font-size: 64rpx;
  opacity: 0.5;
}

.chart-text {
  font-size: 24rpx;
  color: #7F8C8D;
  font-weight: 500;
}

.trends-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx;
  background: #F8FAFC;
  border-radius: 12rpx;
}

.summary-label {
  font-size: 22rpx;
  color: #BDC3C7;
  font-weight: 500;
}

.summary-value {
  font-size: 28rpx;
  color: #2C3E50;
  font-weight: 700;
}

/* AI 建议卡片 */
.ai-suggestion-card {
  background: linear-gradient(135deg, #8B7FD6 0%, #B794F6 100%);
  border-radius: 28rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(139, 127, 214, 0.25);
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.ai-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.ai-title {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.ai-label {
  font-size: 28rpx;
  color: white;
  font-weight: 700;
}

.ai-subtitle {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
}

.ai-content {
  margin-bottom: 20rpx;
}

.ai-text {
  font-size: 26rpx;
  color: white;
  line-height: 1.75;
  font-weight: 400;
}

.ai-actions {
  display: flex;
  justify-content: flex-end;
}

.ai-action-btn {
  padding: 16rpx 32rpx;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  font-size: 24rpx;
  color: white;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-action-btn:active {
  transform: scale(0.96);
  background: rgba(255, 255, 255, 0.35);
}

/* 快捷服务网格 */
.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.service-card {
  background: white;
  border-radius: 20rpx;
  padding: 28rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:active {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
}

.service-icon-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rpx;
}

.service-bg-0 {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
}

.service-bg-1 {
  background: linear-gradient(135deg, #8B7FD6 0%, #B794F6 100%);
}

.service-bg-2 {
  background: linear-gradient(135deg, #5FD068 0%, #3EBD5B 100%);
}

.service-bg-3 {
  background: linear-gradient(135deg, #FFB84D 0%, #FF9F1A 100%);
}

.service-bg-4 {
  background: linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%);
}

.service-bg-5 {
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%);
}

.service-icon {
  font-size: 40rpx;
}

.service-name {
  font-size: 26rpx;
  color: #2C3E50;
  font-weight: 600;
  text-align: center;
}

.service-desc {
  font-size: 20rpx;
  color: #BDC3C7;
  text-align: center;
}

/* 最近活动列表 */
.activity-list {
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  gap: 20rpx;
  border-bottom: 1rpx solid #F0F3F7;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:active {
  background: #F8FAFC;
  transform: translateX(8rpx);
}

.activity-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  flex-shrink: 0;
}

.activity-type-upload {
  background: linear-gradient(135deg, rgba(78, 205, 196, 0.15) 0%, rgba(68, 168, 242, 0.15) 100%);
}

.activity-type-medication {
  background: linear-gradient(135deg, rgba(255, 184, 77, 0.15) 0%, rgba(255, 159, 26, 0.15) 100%);
}

.activity-type-chat {
  background: linear-gradient(135deg, rgba(139, 127, 214, 0.15) 0%, rgba(183, 148, 246, 0.15) 100%);
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.activity-title {
  font-size: 28rpx;
  color: #2C3E50;
  font-weight: 500;
}

.activity-time {
  font-size: 22rpx;
  color: #BDC3C7;
}

.activity-arrow {
  font-size: 28rpx;
  color: #E1E8ED;
  font-weight: 300;
}
</style>
