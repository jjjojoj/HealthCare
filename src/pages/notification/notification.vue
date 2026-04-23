<template>
  <view class="page">
    <AppHeader title="消息中心" :show-back="true" />

    <view class="content">
      <!-- Tab 过滤 -->
      <view class="tab-bar">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-item"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        >
          <text class="tab-text">{{ tab.label }}</text>
          <view v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</view>
        </view>
      </view>

      <!-- 全部已读 -->
      <view class="mark-all" v-if="unreadCount > 0" @click="markAllRead">
        <text class="mark-all-text">全部标记已读</text>
      </view>

      <!-- 通知列表 -->
      <scroll-view scroll-y class="notification-list">
        <view
          v-for="(item, index) in filteredList"
          :key="index"
          class="notification-card"
          :class="{ unread: !item.read }"
          @click="readNotification(index)"
        >
          <view class="card-left">
            <view :class="['type-dot', 'dot-' + item.type]"></view>
          </view>
          <view class="card-body">
            <view class="card-top">
              <text class="card-title">{{ item.title }}</text>
              <text class="card-time">{{ item.time }}</text>
            </view>
            <text class="card-desc">{{ item.desc }}</text>
          </view>
          <view class="card-right">
            <view v-if="!item.read" class="unread-dot"></view>
            <text class="delete-btn" @click.stop="deleteNotification(index)">x</text>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="filteredList.length === 0" class="empty-state">
          <view class="empty-icon-wrap">
            <view class="empty-bell"></view>
          </view>
          <text class="empty-text">暂无消息</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref(0)

const tabs = computed(() => [
  { label: '全部', type: 'all', count: 0 },
  { label: '用药提醒', type: 'medication', count: notifications.value.filter(n => n.type === 'medication' && !n.read).length },
  { label: '复查提醒', type: 'followup', count: notifications.value.filter(n => n.type === 'followup' && !n.read).length },
  { label: '系统', type: 'system', count: notifications.value.filter(n => n.type === 'system' && !n.read).length }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const filteredList = computed(() => {
  const type = tabs.value[activeTab.value].type
  if (type === 'all') return notifications.value
  return notifications.value.filter(n => n.type === type)
})

const notifications = ref([
  { type: 'medication', title: '用药提醒', desc: '您有一项用药计划即将到达服药时间：阿莫西林胶囊，请按时服用。', time: '10分钟前', read: false },
  { type: 'followup', title: '复查提醒', desc: '您的皮肤科复查预约将于明天上午进行，请提前做好准备。', time: '2小时前', read: false },
  { type: 'system', title: '系统更新', desc: '健康管理中心已更新至最新版本，新增健康档案管理功能。', time: '昨天', read: false },
  { type: 'medication', title: '用药完成', desc: '您已连续服用维生素C 7天，请继续坚持。', time: '昨天', read: true },
  { type: 'followup', title: '复查预约确认', desc: '您的内科复查已确认，时间为下周三下午2:00。', time: '3天前', read: true },
  { type: 'system', title: '安全提醒', desc: '您的账户在新设备上登录，如非本人操作请及时修改密码。', time: '3天前', read: true },
  { type: 'medication', title: '药物库存提醒', desc: '您的布洛芬库存不足，建议及时补充。', time: '5天前', read: false },
  { type: 'system', title: '健康报告', desc: '您的月度健康报告已生成，点击查看详情。', time: '1周前', read: true },
  { type: 'followup', title: '体检提醒', desc: '距您上次全面体检已过去半年，建议安排体检。', time: '1周前', read: false },
  { type: 'medication', title: '用药提醒', desc: '降压药硝苯地平缓释片需在餐后服用，请勿空腹。', time: '2周前', read: true }
])

function readNotification(index) {
  notifications.value[index].read = true
}

function deleteNotification(index) {
  const type = tabs.value[activeTab.value].type
  const list = type === 'all' ? notifications.value : notifications.value.filter(n => n.type === type)
  const realIndex = notifications.value.indexOf(list[index])
  if (realIndex > -1) notifications.value.splice(realIndex, 1)
}

function markAllRead() {
  notifications.value.forEach(n => { n.read = true })
  uni.showToast({ title: '已全部标记已读', icon: 'success' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.content {
  padding-top: 8rpx;
}

.tab-bar {
  display: flex;
  background: #fff;
  padding: 16rpx 24rpx;
  gap: 8rpx;
}

.tab-item {
  flex: 1;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32rpx;
  position: relative;
  transition: all 0.2s;

  &.active {
    background: #37CD87;
  }
}

.tab-text {
  font-size: 26rpx;
  color: #595959;

  .active & { color: #fff; font-weight: 500; }
}

.tab-badge {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  min-width: 32rpx;
  height: 32rpx;
  background: #F5222D;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;

  /* hide text, just show dot */
  font-size: 0;
  width: 16rpx;
  min-width: 16rpx;
  height: 16rpx;
  min-height: 16rpx;
}

.mark-all {
  padding: 16rpx 32rpx;
  display: flex;
  justify-content: flex-end;
}

.mark-all-text {
  font-size: 26rpx;
  color: #37CD87;
}

.notification-list {
  padding: 0 24rpx;
  height: calc(100vh - 200rpx);
}

.notification-card {
  display: flex;
  align-items: flex-start;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  transition: opacity 0.2s;

  &.unread { background: #FAFFF7; }
}

.card-left {
  padding-top: 16rpx;
  margin-right: 20rpx;
}

.type-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;

  &.dot-medication { background: #1890FF; }
  &.dot-followup { background: #FA8C16; }
  &.dot-system { background: #C0C0C0; }
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;

  .unread & { color: #262626; }
}

.card-time {
  font-size: 22rpx;
  color: #C0C0C0;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.card-desc {
  font-size: 26rpx;
  color: #8C8C8C;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-left: 16rpx;
  flex-shrink: 0;
}

.unread-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #37CD87;
}

.delete-btn {
  font-size: 28rpx;
  color: #C0C0C0;
  padding: 8rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-icon-wrap {
  width: 120rpx;
  height: 120rpx;
  background: #F0F0F0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.empty-bell {
  width: 40rpx;
  height: 40rpx;
  border: 6rpx solid #C0C0C0;
  border-radius: 20rpx 20rpx 0 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -12rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 16rpx;
    height: 8rpx;
    background: #C0C0C0;
    border-radius: 0 0 8rpx 8rpx;
  }
}

.empty-text {
  font-size: 28rpx;
  color: #C0C0C0;
}
</style>
