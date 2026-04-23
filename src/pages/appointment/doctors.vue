<template>
  <view class="page">
    <AppHeader :title="deptName + ' - 选择医生'" :show-back="true" />

    <scroll-view scroll-y class="content">
      <view class="doctor-card" v-for="(doc, index) in doctors" :key="index" @click="goSchedule(doc)">
        <view class="doc-avatar" :style="{ background: doc.color }">
          <text class="doc-avatar-text">{{ doc.name.charAt(0) }}</text>
        </view>
        <view class="doc-info">
          <view class="doc-top">
            <text class="doc-name">{{ doc.name }}</text>
            <text class="doc-title">{{ doc.title }}</text>
          </view>
          <text class="doc-dept">{{ deptName }}</text>
          <view class="doc-tags">
            <text class="doc-tag" v-for="(tag, ti) in doc.tags" :key="ti">{{ tag }}</text>
          </view>
          <view class="doc-bottom">
            <view class="doc-rating">
              <text class="rating-score">{{ doc.rating }}</text>
              <text class="rating-label">评分</text>
            </view>
            <view class="doc-stat">
              <text class="stat-num">{{ doc.served }}</text>
              <text class="stat-label">服务人次</text>
            </view>
            <view class="doc-fee">
              <text class="fee-num">{{ doc.fee }}</text>
              <text class="fee-label">元/次</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const deptName = ref('内科')

const doctors = ref([
  { name: '李明华', title: '主任医师', tags: ['高血压', '糖尿病', '冠心病'], rating: 4.9, served: 3260, fee: 50, color: 'rgba(55,205,135,0.15)' },
  { name: '王秀英', title: '副主任医师', tags: ['呼吸系统', '慢性病'], rating: 4.8, served: 2180, fee: 35, color: 'rgba(24,144,255,0.15)' },
  { name: '张建国', title: '主治医师', tags: ['消化系统', '肝病'], rating: 4.7, served: 1560, fee: 25, color: 'rgba(250,140,22,0.15)' },
  { name: '陈晓燕', title: '副主任医师', tags: ['内分泌', '甲状腺'], rating: 4.8, served: 1890, fee: 35, color: 'rgba(235,47,150,0.15)' },
  { name: '赵伟', title: '主治医师', tags: ['感染科', '发热'], rating: 4.6, served: 980, fee: 25, color: 'rgba(114,46,209,0.15)' }
])

onLoad((query) => {
  if (query.dept) deptName.value = query.dept
})

function goSchedule(doc) {
  const params = encodeURIComponent(JSON.stringify({ name: doc.name, title: doc.title, fee: doc.fee, dept: deptName.value }))
  uni.navigateTo({ url: '/pages/appointment/schedule?doc=' + params })
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

.doctor-card {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  gap: 24rpx;
}

.doc-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doc-avatar-text {
  font-size: 36rpx;
  font-weight: 700;
  color: #262626;
}

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-top {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 6rpx;
}

.doc-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #262626;
}

.doc-title {
  font-size: 24rpx;
  color: #37CD87;
  background: #E8F8EF;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.doc-dept {
  font-size: 24rpx;
  color: #8C8C8C;
  margin-bottom: 12rpx;
}

.doc-tags {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
  margin-bottom: 16rpx;
}

.doc-tag {
  font-size: 22rpx;
  color: #595959;
  background: #F5F5F5;
  padding: 4rpx 14rpx;
  border-radius: 6rpx;
}

.doc-bottom {
  display: flex;
  gap: 40rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #F5F5F5;
}

.doc-rating, .doc-stat, .doc-fee {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}

.rating-score, .stat-num, .fee-num {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
}

.rating-label, .stat-label, .fee-label {
  font-size: 22rpx;
  color: #C0C0C0;
}
</style>
