<template>
  <view class="page">
    <AppHeader :title="doc.name + ' - 选择时间'" :show-back="true" />

    <scroll-view scroll-y class="content">
      <!-- 日期选择 -->
      <view class="section">
        <text class="section-title">选择日期</text>
        <scroll-view scroll-x class="date-scroll">
          <view class="date-list">
            <view
              v-for="(day, index) in dateList"
              :key="index"
              class="date-item"
              :class="{ active: selectedDate === index, disabled: day.disabled }"
              @click="!day.disabled && (selectedDate = index)"
            >
              <text class="date-week">{{ day.week }}</text>
              <text class="date-day">{{ day.day }}</text>
              <text class="date-month">{{ day.month }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 时段选择 -->
      <view class="section">
        <text class="section-title">选择时段</text>
        <view class="time-grid">
          <view
            v-for="(slot, index) in timeSlots"
            :key="index"
            class="time-slot"
            :class="{ active: selectedTime === index, disabled: slot.disabled }"
            @click="!slot.disabled && (selectedTime = index)"
          >
            <text class="time-text">{{ slot.time }}</text>
            <text class="time-status">{{ slot.status }}</text>
          </view>
        </view>
      </view>

      <!-- 医生信息摘要 -->
      <view class="doc-summary">
        <view class="summary-avatar" :style="{ background: doc.color }">
          <text class="summary-avatar-text">{{ doc.name.charAt(0) }}</text>
        </view>
        <view class="summary-info">
          <text class="summary-name">{{ doc.name }}</text>
          <text class="summary-title">{{ doc.title }} | {{ doc.dept }}</text>
        </view>
        <view class="summary-fee">
          <text class="fee-amount">{{ doc.fee }}</text>
          <text class="fee-unit">元</text>
        </view>
      </view>

      <!-- 下一步 -->
      <view class="action-section">
        <view
          class="next-btn"
          :class="{ disabled: selectedTime < 0 }"
          @click="goConfirm"
        >
          <text class="next-btn-text">确认预约</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const selectedDate = ref(0)
const selectedTime = ref(-1)
const doc = ref({ name: '李明华', title: '主任医师', dept: '内科', fee: 50, color: 'rgba(55,205,135,0.15)' })

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const dateList = computed(() => {
  const list = []
  const now = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    list.push({
      week: i === 0 ? '今天' : weekDays[d.getDay()],
      day: d.getDate(),
      month: (d.getMonth() + 1) + '月',
      disabled: d.getDay() === 0
    })
  }
  return list
})

const timeSlots = ref([
  { time: '08:00-08:30', status: '可预约', disabled: false },
  { time: '08:30-09:00', status: '可预约', disabled: false },
  { time: '09:00-09:30', status: '可预约', disabled: false },
  { time: '09:30-10:00', status: '约满', disabled: true },
  { time: '10:00-10:30', status: '可预约', disabled: false },
  { time: '10:30-11:00', status: '可预约', disabled: false },
  { time: '14:00-14:30', status: '可预约', disabled: false },
  { time: '14:30-15:00', status: '约满', disabled: true },
  { time: '15:00-15:30', status: '可预约', disabled: false },
  { time: '15:30-16:00', status: '可预约', disabled: false },
  { time: '16:00-16:30', status: '可预约', disabled: false },
  { time: '16:30-17:00', status: '约满', disabled: true }
])

onLoad((query) => {
  if (query.doc) {
    try {
      const data = JSON.parse(decodeURIComponent(query.doc))
      doc.value = { ...doc.value, ...data }
    } catch (e) {}
  }
})

function goConfirm() {
  if (selectedTime.value < 0) {
    uni.showToast({ title: '请选择时段', icon: 'none' })
    return
  }
  const date = dateList.value[selectedDate.value]
  const slot = timeSlots.value[selectedTime.value]
  const params = encodeURIComponent(JSON.stringify({
    doc: doc.value,
    date: date.day + '日 ' + date.month,
    week: date.week,
    time: slot.time
  }))
  uni.navigateTo({ url: '/pages/appointment/confirm?data=' + params })
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
}

/* 日期 */
.date-scroll {
  white-space: nowrap;
  width: 100%;
}

.date-list {
  display: inline-flex;
  gap: 16rpx;
}

.date-item {
  width: 120rpx;
  height: 140rpx;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  flex-shrink: 0;
  transition: all 0.2s;

  &.active {
    background: #37CD87;
    .date-week, .date-day, .date-month { color: #fff; }
  }

  &.disabled {
    opacity: 0.4;
  }
}

.date-week {
  font-size: 22rpx;
  color: #8C8C8C;
}

.date-day {
  font-size: 36rpx;
  font-weight: 700;
  color: #262626;
}

.date-month {
  font-size: 20rpx;
  color: #C0C0C0;
}

/* 时段 */
.time-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.time-slot {
  width: calc((100% - 32rpx) / 3);
  height: 88rpx;
  background: #fff;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  border: 2rpx solid transparent;

  &.active {
    border-color: #37CD87;
    background: #FAFFF7;

    .time-text { color: #37CD87; }
  }

  &.disabled {
    opacity: 0.35;
    .time-status { color: #F5222D; }
  }
}

.time-text {
  font-size: 24rpx;
  color: #262626;
  font-weight: 500;
}

.time-status {
  font-size: 20rpx;
  color: #8C8C8C;
}

/* 医生摘要 */
.doc-summary {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.summary-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-avatar-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #262626;
}

.summary-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.summary-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
}

.summary-title {
  font-size: 24rpx;
  color: #8C8C8C;
}

.summary-fee {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.fee-amount {
  font-size: 36rpx;
  font-weight: 700;
  color: #F5222D;
}

.fee-unit {
  font-size: 22rpx;
  color: #F5222D;
}

/* 按钮 */
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

.next-btn {
  height: 96rpx;
  background: linear-gradient(135deg, #37CD87, #2DB873);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.disabled {
    opacity: 0.4;
  }
}

.next-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  letter-spacing: 4rpx;
}
</style>
