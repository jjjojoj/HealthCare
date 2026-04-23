<template>
  <view class="page">
    <AppHeader title="文章详情" :show-back="true" />

    <scroll-view scroll-y class="content">
      <view class="article-header">
        <view class="article-category-tag">{{ article.category }}</view>
        <text class="article-title">{{ article.title }}</text>
        <view class="article-meta">
          <text class="meta-date">{{ article.date }}</text>
          <text class="meta-sep">/</text>
          <text class="meta-views">{{ article.views }} 阅读</text>
        </view>
      </view>

      <view class="article-body">
        <text class="body-text">{{ article.desc }}</text>
        <text class="body-text body-indent">随着人们健康意识的不断提升，越来越多的人开始关注如何科学地管理自己的健康。本文将从多个维度为您详细介绍相关知识和实用建议。</text>

        <text class="section-heading">一、基本认知</text>
        <text class="body-text body-indent">了解基本知识是健康管理的第一步。正确的认知可以帮助我们做出更明智的健康决策，避免盲目跟风或轻信不实信息。</text>

        <text class="section-heading">二、日常管理</text>
        <text class="body-text body-indent">日常管理是健康管理中最重要的一环。通过建立良好的生活习惯，可以有效降低患病风险，提升生活质量。建议做到以下几点：</text>
        <text class="body-text body-indent">1. 保持规律的作息时间，每天保证 7-8 小时的充足睡眠</text>
        <text class="body-text body-indent">2. 坚持适度运动，每周至少进行 150 分钟中等强度有氧运动</text>
        <text class="body-text body-indent">3. 饮食均衡，多吃蔬菜水果，控制油盐糖的摄入</text>
        <text class="body-text body-indent">4. 定期体检，及时了解自身健康状况</text>

        <text class="section-heading">三、注意事项</text>
        <text class="body-text body-indent">在健康管理过程中，需要注意以下几点：首先，不要轻信网络上未经证实的健康信息；其次，出现身体不适时应及时就医，不要自行用药；最后，保持积极乐观的心态同样重要。</text>

        <text class="body-text body-indent body-note">本文内容仅供参考，不构成医疗建议。如有健康问题，请咨询专业医生。</text>
      </view>

      <!-- 相关推荐 -->
      <view class="related-section">
        <text class="related-title">相关推荐</text>
        <view class="related-card" v-for="(item, index) in relatedArticles" :key="index">
          <text class="related-name">{{ item.title }}</text>
          <text class="related-views">{{ item.views }} 阅读</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const article = ref({
  title: '高血压患者的日常管理指南',
  desc: '了解如何通过饮食、运动和药物治疗有效控制血压水平',
  category: '慢病管理',
  date: '2025-10-04',
  views: 2340
})

const relatedArticles = ref([
  { title: '糖尿病患者饮食控制要点', views: 2678 },
  { title: '秋季养生：润肺防燥的五个方法', views: 3102 },
  { title: '睡眠质量提升的十个习惯', views: 5670 }
])

onLoad((query) => {
  if (query.data) {
    try {
      const data = JSON.parse(decodeURIComponent(query.data))
      article.value = data
    } catch (e) {}
  }
})
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #F5F5F5;
}

.content {
  padding-bottom: 40rpx;
}

.article-header {
  background: #fff;
  padding: 32rpx;
  padding-top: 16rpx;
  margin-bottom: 16rpx;
}

.article-category-tag {
  display: inline-block;
  font-size: 22rpx;
  color: #37CD87;
  background: #E8F8EF;
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  margin-bottom: 16rpx;
}

.article-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #262626;
  line-height: 1.4;
  margin-bottom: 16rpx;
  display: block;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.meta-date, .meta-views {
  font-size: 24rpx;
  color: #C0C0C0;
}

.meta-sep {
  font-size: 16rpx;
  color: #E0E0E0;
}

.article-body {
  background: #fff;
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.body-text {
  font-size: 28rpx;
  color: #333333;
  line-height: 2;
  display: block;
  margin-bottom: 16rpx;
}

.body-indent {
  text-indent: 2em;
}

.section-heading {
  font-size: 30rpx;
  font-weight: 600;
  color: #262626;
  display: block;
  margin: 32rpx 0 16rpx;
}

.body-note {
  color: #C0C0C0;
  font-size: 24rpx;
  font-style: italic;
  margin-top: 32rpx;
}

.related-section {
  background: #fff;
  padding: 32rpx;
}

.related-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #262626;
  margin-bottom: 20rpx;
  display: block;
}

.related-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F5F5F5;

  &:last-child { border-bottom: none; }
}

.related-name {
  font-size: 26rpx;
  color: #595959;
  flex: 1;
}

.related-views {
  font-size: 22rpx;
  color: #C0C0C0;
  margin-left: 16rpx;
  flex-shrink: 0;
}
</style>
