# 📱 HealthCare H5页面设计说明

> 简洁版设计规范 - 供Agent生成页面使用

---

## 🎯 项目概述

**项目类型**: uni-app 医疗健康管理系统
**技术栈**: Vue 3 + Composition API + Vite
**目标平台**: H5 + 微信小程序
**设计风格**: 2025现代医疗风格 - 蓝绿渐变系

---

## 🏗️ 整体架构

### 技术框架
```
uni-app 3.x
├── Vue 3 (Composition API)
├── Vite 5.x (构建工具)
├── SCSS (样式预处理)
└── 响应式单位 rpx
```

### 项目结构
```
src/
├── pages/              # 页面文件
│   ├── home/          # 首页
│   ├── records/       # 病历管理
│   ├── chatbot/       # AI咨询
│   └── my/            # 个人中心
├── components/        # 全局组件
│   ├── AppHeader.vue  # 页面头部
│   └── BottomNav.vue  # 底部导航
├── styles/            # 样式文件
│   └── theme-modern.scss  # 现代化主题
└── static/            # 静态资源
```

---

## 🎨 设计系统

### 配色方案

**主色调**
```scss
健康青绿: #4ECDC4
健康蓝:   #44A8F2
健康紫:   #8B7FD6
```

**功能色**
```scss
成功: #5FD068
警告: #FFB84D
错误: #FF6B6B
```

**中性色**
```scss
主文字: #2C3E50
次文字: #7F8C8D
辅助文字: #BDC3C7
背景: #F5F7FA
```

**渐变色**
```scss
主渐变: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%)
AI渐变: linear-gradient(135deg, #8B7FD6 0%, #B794F6 100%)
```

### 字体规范

| 用途 | 字号 | 字重 |
|------|------|------|
| 大标题 | 42rpx | 700 |
| 标题 | 32rpx | 700 |
| 正文 | 28rpx | 400 |
| 辅助 | 24rpx | 500 |
| 小字 | 20rpx | 500 |

### 间距规范

```scss
xs: 8rpx    sm: 12rpx   md: 16rpx
lg: 24rpx   xl: 32rpx   xxl: 48rpx
```

### 圆角规范

```scss
按钮: 10rpx   小卡片: 16rpx   标准卡片: 24rpx
大卡片: 32rpx   圆形: 50%
```

### 阴影规范

```scss
小阴影: 0 4rpx 12rpx rgba(0,0,0,0.06)
标准: 0 6rpx 20rpx rgba(0,0,0,0.08)
大阴影: 0 10rpx 30rpx rgba(0,0,0,0.10)
彩色: 0 8rpx 24rpx rgba(78,205,196,0.20)
```

---

## 📄 页面模板

### 标准页面结构

```vue
<template>
  <view class="page">
    <!-- 顶部导航 -->
    <AppHeader title="页面标题" />

    <!-- 主要内容 -->
    <view class="content">
      <!-- 内容区域 -->
    </view>

    <!-- 底部导航(如需要) -->
    <BottomNav />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'

// 响应式数据
const data = ref([])

onMounted(() => {
  // 页面加载逻辑
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0F4F8 0%, #FAFBFC 100%);
  padding-bottom: 120rpx;
}

.content {
  padding: 24rpx 32rpx;
}
</style>
```

---

## 🧩 核心组件

### 1. 卡片组件

**基础卡片**
```vue
<view class="card">
  <view class="card-header">
    <text class="card-title">标题</text>
  </view>
  <view class="card-body">
    <!-- 内容 -->
  </view>
</view>

<style scoped>
.card {
  background: white;
  border-radius: 24rpx;
  padding: 28rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.06);
  border: 1rpx solid #F0F3F7;
  margin-bottom: 20rpx;
}
</style>
```

**渐变卡片**
```vue
<view class="gradient-card">
  <!-- 内容 -->
</view>

<style scoped>
.gradient-card {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
  border-radius: 28rpx;
  padding: 32rpx;
  color: white;
  box-shadow: 0 8rpx 24rpx rgba(78,205,196,0.25);
}
</style>
```

### 2. 按钮组件

**主按钮**
```vue
<view class="btn-primary">
  <text>确认</text>
</view>

<style scoped>
.btn-primary {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
  color: white;
  padding: 20rpx 48rpx;
  border-radius: 48rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 700;
  box-shadow: 0 8rpx 24rpx rgba(78,205,196,0.3);
}

.btn-primary:active {
  transform: translateY(-4rpx);
  box-shadow: 0 12rpx 32rpx rgba(78,205,196,0.4);
}
</style>
```

**次要按钮**
```vue
<view class="btn-secondary">
  <text>取消</text>
</view>

<style scoped>
.btn-secondary {
  background: white;
  color: #4ECDC4;
  border: 2rpx solid #4ECDC4;
  padding: 20rpx 48rpx;
  border-radius: 48rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 600;
}

.btn-secondary:active {
  background: rgba(78,205,196,0.1);
}
</style>
```

### 3. 列表项

```vue
<view class="list-item">
  <view class="item-icon">📋</view>
  <view class="item-content">
    <text class="item-title">标题</text>
    <text class="item-desc">描述文字</text>
  </view>
  <view class="item-arrow">→</view>
</view>

<style scoped>
.list-item {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  background: white;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  gap: 20rpx;
}

.item-icon {
  font-size: 40rpx;
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(78,205,196,0.15) 0%, rgba(68,168,242,0.15) 100%);
  border-radius: 16rpx;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.item-title {
  font-size: 28rpx;
  color: #2C3E50;
  font-weight: 600;
}

.item-desc {
  font-size: 24rpx;
  color: #BDC3C7;
}

.item-arrow {
  font-size: 28rpx;
  color: #E1E8ED;
}
</style>
```

### 4. 标签组

```vue
<view class="tags">
  <view class="tag tag-primary">标签1</view>
  <view class="tag tag-success">标签2</view>
  <view class="tag tag-warning">标签3</view>
</view>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.tag {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: white;
}

.tag-primary {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
}

.tag-success {
  background: linear-gradient(135deg, #5FD068 0%, #3EBD5B 100%);
}

.tag-warning {
  background: linear-gradient(135deg, #FFB84D 0%, #FF9F1A 100%);
}
</style>
```

### 5. 统计卡片

```vue
<view class="stats-grid">
  <view class="stat-card">
    <text class="stat-icon">📊</text>
    <text class="stat-value">128</text>
    <text class="stat-label">总数</text>
  </view>
  <view class="stat-card">
    <text class="stat-icon">📈</text>
    <text class="stat-value">24</text>
    <text class="stat-label">本月</text>
  </view>
</view>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.stat-card {
  background: white;
  border-radius: 20rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
}

.stat-icon {
  font-size: 40rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 800;
  color: #2C3E50;
}

.stat-label {
  font-size: 22rpx;
  color: #7F8C8D;
}
</style>
```

---

## 📐 布局规范

### 网格布局

**2列网格**
```scss
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}
```

**3列网格**
```scss
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}
```

### Flex布局

**水平居中**
```scss
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**两端对齐**
```scss
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

---

## 🎭 交互规范

### 点击反馈

```scss
/* 卡片点击 */
.card:active {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 32rpx rgba(78,205,196,0.15);
}

/* 按钮点击 */
.button:active {
  transform: translateY(2rpx) scale(0.98);
}

/* 图标点击 */
.icon:active {
  transform: scale(0.92);
}
```

### 动画时长

```scss
/* 标准过渡 */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* 快速反馈 */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* 弹性动画 */
transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 📱 响应式适配

### 单位使用

- **尺寸单位**: 全部使用 `rpx` (自动适配不同屏幕)
- **字体**: 使用 `rpx` 保证跨设备一致
- **图片**: 使用百分比或 `rpx`

### 安全区适配

```scss
/* 底部安全区 */
padding-bottom: env(safe-area-inset-bottom);

/* 顶部安全区 */
padding-top: env(safe-area-inset-top);
```

---

## 🛠️ 常用工具类

```scss
/* 文字省略 */
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 两行省略 */
.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 毛玻璃效果 */
.glass {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx) saturate(180%);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
}

/* 渐变文字 */
.gradient-text {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A8F2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 📝 页面生成指南

### 基本步骤

1. **创建页面文件**: `src/pages/功能名/页面名.vue`
2. **使用标准模板**: 复制页面模板结构
3. **应用设计系统**: 使用规定的颜色、字体、间距
4. **使用核心组件**: 卡片、按钮、列表等
5. **添加交互**: 点击反馈、动画效果
6. **测试适配**: 检查不同屏幕尺寸

### 命名规范

- **页面**: kebab-case (如: `user-profile.vue`)
- **组件**: PascalCase (如: `UserCard.vue`)
- **样式类**: kebab-case (如: `.user-card`)
- **变量**: camelCase (如: `userName`)

---

## 🎯 关键要点

1. **全部使用 rpx 单位** - 自动适配不同屏幕
2. **使用 Vue 3 Composition API** - `<script setup>`
3. **渐变色是核心** - 蓝绿渐变营造医疗感
4. **卡片式布局** - 信息模块化展示
5. **柔和阴影** - 提升视觉层次
6. **点击反馈必须有** - 提升用户体验
7. **图标使用Emoji** - 保证跨平台一致性

---

## 📚 参考示例

**首页**: `/pages/home/home.vue`
- Hero区域 + 健康评分
- 健康趋势卡片
- AI助手卡片
- 快捷服务网格

**病历列表**: `/src/pages/records/list.vue`
- 统计卡片
- 筛选标签
- 病历卡片列表

**底部导航**: `/src/components/BottomNav.vue`
- 毛玻璃背景
- 活跃状态动画

---

**文档版本**: v1.0
**更新日期**: 2025-01-10
**适用范围**: HealthCare uni-app H5页面开发
