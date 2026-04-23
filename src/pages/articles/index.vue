<template>
  <view class="page">
    <AppHeader title="健康科普" :show-back="true" />

    <view class="content">
      <!-- 分类标签 -->
      <scroll-view scroll-x class="category-bar">
        <view
          v-for="(cat, index) in categories"
          :key="index"
          class="category-item"
          :class="{ active: activeCategory === index }"
          @click="activeCategory = index"
        >
          <text class="category-text">{{ cat }}</text>
        </view>
      </scroll-view>

      <!-- 文章列表 -->
      <scroll-view scroll-y class="article-list">
        <view
          v-for="(article, index) in filteredArticles"
          :key="index"
          class="article-card"
          @click="goDetail(article)"
        >
          <view class="article-cover" :style="{ background: article.coverColor }">
            <text class="cover-title">{{ article.title.substring(0, 2) }}</text>
          </view>
          <view class="article-info">
            <text class="article-title">{{ article.title }}</text>
            <text class="article-desc">{{ article.desc }}</text>
            <view class="article-meta">
              <text class="article-category">{{ article.category }}</text>
              <text class="article-dot">/</text>
              <text class="article-date">{{ article.date }}</text>
              <text class="article-dot">/</text>
              <text class="article-views">{{ article.views }} 阅读</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCategory = ref(0)
const categories = ['全部', '慢病管理', '用药常识', '养生保健', '心理健康', '营养饮食']

const articles = ref([
  { title: '高血压患者的日常管理指南', desc: '了解如何通过饮食、运动和药物治疗有效控制血压水平', category: '慢病管理', date: '2025-10-04', views: 2340, coverColor: 'rgba(245,34,45,0.1)' },
  { title: '儿童用药安全注意事项', desc: '家长必知的儿童用药原则和常见误区，保障孩子用药安全', category: '用药常识', date: '2025-10-03', views: 1856, coverColor: 'rgba(114,46,209,0.1)' },
  { title: '秋季养生：润肺防燥的五个方法', desc: '秋季气候干燥，中医教你如何通过饮食和生活习惯养阴润肺', category: '养生保健', date: '2025-10-02', views: 3102, coverColor: 'rgba(250,173,20,0.1)' },
  { title: '糖尿病患者饮食控制要点', desc: '科学饮食是糖尿病管理的基础，掌握这些原则轻松控糖', category: '慢病管理', date: '2025-10-01', views: 2678, coverColor: 'rgba(55,205,135,0.1)' },
  { title: '如何识别和应对焦虑情绪', desc: '现代人常见的焦虑症状有哪些？如何通过科学方法缓解焦虑', category: '心理健康', date: '2025-09-30', views: 4210, coverColor: 'rgba(24,144,255,0.1)' },
  { title: '蛋白质摄入：你真的吃够了吗', desc: '蛋白质是人体必需营养素，了解每日推荐摄入量和优质蛋白来源', category: '营养饮食', date: '2025-09-29', views: 1987, coverColor: 'rgba(82,196,26,0.1)' },
  { title: '抗生素使用的正确方式', desc: '滥用抗生素危害大，了解何时该用、何时不该用以及正确用法', category: '用药常识', date: '2025-09-28', views: 3450, coverColor: 'rgba(250,140,22,0.1)' },
  { title: '睡眠质量提升的十个习惯', desc: '优质睡眠对健康至关重要，培养这些好习惯改善睡眠质量', category: '养生保健', date: '2025-09-27', views: 5670, coverColor: 'rgba(19,194,194,0.1)' }
])

const filteredArticles = computed(() => {
  if (activeCategory.value === 0) return articles.value
  return articles.value.filter(a => a.category === categories.value[activeCategory.value])
})

function goDetail(article) {
  const params = encodeURIComponent(JSON.stringify(article))
  uni.navigateTo({ url: '/pages/articles/detail?data=' + params })
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

.category-bar {
  white-space: nowrap;
  padding: 16rpx 24rpx;
  background: #fff;
  gap: 16rpx;
}

.category-item {
  display: inline-flex;
  padding: 12rpx 28rpx;
  border-radius: 28rpx;
  background: #F5F5F5;
  margin-right: 16rpx;

  &.active {
    background: #37CD87;
  }
}

.category-text {
  font-size: 26rpx;
  color: #595959;
  white-space: nowrap;

  .active & { color: #fff; }
}

.article-list {
  padding: 24rpx;
  height: calc(100vh - 160rpx);
}

.article-card {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  gap: 24rpx;
}

.article-cover {
  width: 180rpx;
  height: 130rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cover-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #262626;
}

.article-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-desc {
  font-size: 24rpx;
  color: #8C8C8C;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.article-category {
  font-size: 22rpx;
  color: #37CD87;
  background: #E8F8EF;
  padding: 2rpx 12rpx;
  border-radius: 4rpx;
}

.article-dot {
  font-size: 16rpx;
  color: #E0E0E0;
}

.article-date, .article-views {
  font-size: 22rpx;
  color: #C0C0C0;
}
</style>
