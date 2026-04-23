<template>
  <view class="page">
    <AppHeader title="预约挂号" :show-back="true" />

    <scroll-view scroll-y class="content">
      <!-- 搜索 -->
      <view class="search-bar">
        <view class="search-input-wrap">
          <input class="search-input" v-model="keyword" placeholder="搜索科室或医生" placeholder-class="search-placeholder" />
        </view>
      </view>

      <!-- 热门科室 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">热门科室</text>
        </view>
        <view class="dept-grid">
          <view
            v-for="(dept, index) in filteredDepts"
            :key="index"
            class="dept-card"
            @click="goDoctors(dept)"
          >
            <view class="dept-icon" :style="{ background: dept.color }">
              <text class="dept-icon-text">{{ dept.abbr }}</text>
            </view>
            <text class="dept-name">{{ dept.name }}</text>
            <text class="dept-count">{{ dept.doctorCount }} 位医生</text>
          </view>
        </view>
      </view>

      <!-- 全部科室 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">全部科室</text>
        </view>
        <view class="dept-list">
          <view
            v-for="(dept, index) in allDepts"
            :key="index"
            class="dept-list-item"
            @click="goDoctors(dept)"
          >
            <text class="dept-list-name">{{ dept.name }}</text>
            <text class="dept-list-arrow">/</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const keyword = ref('')

const departments = ref([
  { name: '内科', abbr: '内', color: 'rgba(55,205,135,0.12)', doctorCount: 12 },
  { name: '外科', abbr: '外', color: 'rgba(24,144,255,0.12)', doctorCount: 8 },
  { name: '皮肤科', abbr: '皮', color: 'rgba(250,140,22,0.12)', doctorCount: 6 },
  { name: '儿科', abbr: '儿', color: 'rgba(114,46,209,0.12)', doctorCount: 9 },
  { name: '妇产科', abbr: '妇', color: 'rgba(235,47,150,0.12)', doctorCount: 7 },
  { name: '骨科', abbr: '骨', color: 'rgba(47,84,235,0.12)', doctorCount: 5 },
  { name: '眼科', abbr: '眼', color: 'rgba(19,194,194,0.12)', doctorCount: 4 },
  { name: '口腔科', abbr: '口', color: 'rgba(82,196,26,0.12)', doctorCount: 6 },
  { name: '中医科', abbr: '中', color: 'rgba(145,109,176,0.12)', doctorCount: 8 },
  { name: '神经内科', abbr: '神', color: 'rgba(250,173,20,0.12)', doctorCount: 5 },
  { name: '心血管内科', abbr: '心', color: 'rgba(245,34,45,0.12)', doctorCount: 7 },
  { name: '消化内科', abbr: '消', color: 'rgba(47,84,235,0.12)', doctorCount: 6 }
])

const allDepts = computed(() => departments.value)

const filteredDepts = computed(() => {
  if (!keyword.value.trim()) return departments.value.slice(0, 8)
  return departments.value.filter(d => d.name.includes(keyword.value.trim()))
})

function goDoctors(dept) {
  uni.navigateTo({ url: '/pages/appointment/doctors?dept=' + dept.name })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.content {
  padding: 24rpx 32rpx;
}

.search-bar {
  margin-bottom: 32rpx;
}

.search-input-wrap {
  background: #fff;
  border-radius: 16rpx;
  padding: 0 28rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #262626;
}

.search-placeholder {
  color: #C0C0C0;
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
  font-size: 30rpx;
  font-weight: 600;
  color: #262626;
}

.dept-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.dept-card {
  width: calc((100% - 40rpx) / 3);
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.dept-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dept-icon-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #262626;
}

.dept-name {
  font-size: 26rpx;
  color: #262626;
  font-weight: 500;
}

.dept-count {
  font-size: 22rpx;
  color: #C0C0C0;
}

.dept-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.dept-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 28rpx;
  border-bottom: 1rpx solid #F5F5F5;

  &:last-child { border-bottom: none; }
}

.dept-list-name {
  font-size: 28rpx;
  color: #262626;
}

.dept-list-arrow {
  font-size: 24rpx;
  color: #C0C0C0;
}
</style>
