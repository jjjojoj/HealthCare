<template>
  <view class="page">
    <view class="search-header">
      <view class="search-input-wrap">
        <input
          class="search-input"
          v-model="keyword"
          placeholder="搜索病历、药品、科普文章"
          placeholder-class="search-placeholder"
          focus
          confirm-type="search"
          @confirm="doSearch"
        />
        <text class="search-clear" v-if="keyword" @click="keyword = ''">x</text>
      </view>
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>

    <scroll-view scroll-y class="content">
      <!-- 搜索历史 -->
      <view class="section" v-if="!hasSearched && searchHistory.length > 0">
        <view class="section-header">
          <text class="section-title">搜索历史</text>
          <text class="clear-history" @click="searchHistory = []">清空</text>
        </view>
        <view class="history-tags">
          <view class="history-tag" v-for="(item, index) in searchHistory" :key="index" @click="quickSearch(item)">
            <text class="history-tag-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 热门搜索 -->
      <view class="section" v-if="!hasSearched">
        <text class="section-title">热门搜索</text>
        <view class="hot-list">
          <view class="hot-item" v-for="(item, index) in hotSearches" :key="index" @click="quickSearch(item)">
            <view class="hot-rank" :class="{ top: index < 3 }">
              <text class="rank-text">{{ index + 1 }}</text>
            </view>
            <text class="hot-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 搜索结果 -->
      <view class="section" v-if="hasSearched">
        <text class="result-title">搜索结果</text>

        <!-- 无结果 -->
        <view v-if="results.length === 0" class="empty-state">
          <view class="empty-box"></view>
          <text class="empty-text">未找到相关内容</text>
          <text class="empty-hint">换个关键词试试</text>
        </view>

        <!-- 结果列表 -->
        <view v-else class="result-list">
          <view class="result-type-label" v-if="results.medical.length > 0">
            <text class="type-text">病历记录</text>
          </view>
          <view class="result-card" v-for="(item, index) in results.medical" :key="'m' + index" @click="goRecord(item)">
            <view class="result-dot dot-blue"></view>
            <view class="result-body">
              <text class="result-name">{{ item.title }}</text>
              <text class="result-meta">{{ item.date }} | {{ item.type }}</text>
            </view>
          </view>

          <view class="result-type-label" v-if="results.medication.length > 0">
            <text class="type-text">药品</text>
          </view>
          <view class="result-card" v-for="(item, index) in results.medication" :key="'d' + index" @click="goMeds(item)">
            <view class="result-dot dot-green"></view>
            <view class="result-body">
              <text class="result-name">{{ item.name }}</text>
              <text class="result-meta">{{ item.spec }}</text>
            </view>
          </view>

          <view class="result-type-label" v-if="results.articles.length > 0">
            <text class="type-text">健康科普</text>
          </view>
          <view class="result-card" v-for="(item, index) in results.articles" :key="'a' + index" @click="goArticle(item)">
            <view class="result-dot dot-orange"></view>
            <view class="result-body">
              <text class="result-name">{{ item.title }}</text>
              <text class="result-meta">{{ item.category }} | {{ item.views }} 阅读</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const keyword = ref('')
const hasSearched = ref(false)

const searchHistory = ref(['阿莫西林', '皮肤过敏', '高血压'])

const hotSearches = ref([
  '感冒用药', '高血压管理', '糖尿病饮食', '失眠调理', '体检报告解读', '儿童疫苗'
])

const results = reactive({
  medical: [],
  medication: [],
  articles: []
})

const mockMedical = [
  { id: 1, title: '皮肤过敏反应检查', date: '2025-10-05', type: '皮肤检查' },
  { id: 2, title: '血常规检查', date: '2025-09-28', type: '血液检查' },
  { id: 3, title: '尿常规检查', date: '2025-09-15', type: '尿液检查' },
  { id: 4, title: '肝功能检查', date: '2025-08-20', type: '肝功能' }
]

const mockMedication = [
  { name: '阿莫西林胶囊', spec: '0.5g*24粒' },
  { name: '布洛芬缓释胶囊', spec: '0.3g*20粒' },
  { name: '硝苯地平缓释片', spec: '30mg*14片' },
  { name: '维生素C片', spec: '100mg*100片' }
]

const mockArticles = [
  { title: '高血压患者的日常管理指南', category: '慢病管理', views: 2340 },
  { title: '儿童用药安全注意事项', category: '用药常识', views: 1856 },
  { title: '抗生素使用的正确方式', category: '用药常识', views: 3450 },
  { title: '糖尿病患者饮食控制要点', category: '慢病管理', views: 2678 }
]

function doSearch() {
  if (!keyword.value.trim()) return
  hasSearched.value = true

  const kw = keyword.value.trim()
  if (!searchHistory.value.includes(kw)) {
    searchHistory.value.unshift(kw)
    if (searchHistory.value.length > 10) searchHistory.value.pop()
  }

  results.medical = mockMedical.filter(m => m.title.includes(kw) || m.type.includes(kw))
  results.medication = mockMedication.filter(m => m.name.includes(kw))
  results.articles = mockArticles.filter(a => a.title.includes(kw) || a.category.includes(kw))
}

function quickSearch(text) {
  keyword.value = text
  doSearch()
}

function goBack() {
  uni.navigateBack()
}

function goRecord(item) {
  uni.navigateTo({ url: '/pages/records/detail?id=' + item.id })
}

function goMeds() {
  uni.switchTab({ url: '/pages/meds/meds' })
}

function goArticle(item) {
  const params = encodeURIComponent(JSON.stringify(item))
  uni.navigateTo({ url: '/pages/articles/detail?data=' + params })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background: #fff;
  gap: 16rpx;
}

.search-input-wrap {
  flex: 1;
  height: 72rpx;
  background: #F5F5F5;
  border-radius: 36rpx;
  padding: 0 28rpx;
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

.search-clear {
  font-size: 28rpx;
  color: #C0C0C0;
  padding: 8rpx;
}

.cancel-btn {
  font-size: 28rpx;
  color: #595959;
  flex-shrink: 0;
}

.content {
  padding: 24rpx 32rpx;
}

.section {
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
}

.clear-history {
  font-size: 24rpx;
  color: #8C8C8C;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.history-tag {
  padding: 10rpx 24rpx;
  background: #fff;
  border-radius: 24rpx;
}

.history-tag-text {
  font-size: 26rpx;
  color: #595959;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx 0;
}

.hot-rank {
  width: 36rpx;
  height: 36rpx;
  border-radius: 8rpx;
  background: #F0F0F0;
  display: flex;
  align-items: center;
  justify-content: center;

  &.top { background: #37CD87; }
}

.rank-text {
  font-size: 22rpx;
  color: #8C8C8C;
  font-weight: 600;

  .top & { color: #fff; }
}

.hot-text {
  font-size: 28rpx;
  color: #262626;
}

/* 结果 */
.result-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 20rpx;
  display: block;
}

.result-type-label {
  margin: 20rpx 0 12rpx;
}

.type-text {
  font-size: 24rpx;
  color: #8C8C8C;
  font-weight: 500;
}

.result-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 12rpx;
  gap: 16rpx;
}

.result-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  flex-shrink: 0;

  &.dot-blue { background: #1890FF; }
  &.dot-green { background: #37CD87; }
  &.dot-orange { background: #FA8C16; }
}

.result-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.result-name {
  font-size: 28rpx;
  color: #262626;
  font-weight: 500;
}

.result-meta {
  font-size: 22rpx;
  color: #C0C0C0;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
}

.empty-box {
  width: 120rpx;
  height: 120rpx;
  background: #F0F0F0;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #8C8C8C;
  margin-bottom: 8rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: #C0C0C0;
}
</style>
