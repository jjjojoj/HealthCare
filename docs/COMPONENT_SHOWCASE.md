# 🧩 组件展示与使用说明

本文档展示所有美化后的组件及其使用方法。

---

## 📱 已美化的组件列表

1. [AppHeader - 应用头部](#appheader---应用头部)
2. [BottomNav - 底部导航](#bottomnav---底部导航)
3. [用户信息卡片](#用户信息卡片)
4. [快捷功能卡片](#快捷功能卡片)
5. [健康数据卡片](#健康数据卡片)
6. [区块标题](#区块标题)
7. [按钮组件](#按钮组件)
8. [菜单列表](#菜单列表)

---

## AppHeader - 应用头部

### 🎨 视觉效果
- 深蓝色渐变背景
- 毛玻璃效果
- 柔和阴影

### 📝 使用方法

```vue
<template>
  <AppHeader title="首页" />
  <!-- 或者显示返回按钮 -->
  <AppHeader title="详情页" :show-back="true" />
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>
```

### 🎯 Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | '' | 页面标题 |
| showBack | Boolean | false | 是否显示返回按钮 |

### 💡 特性

- ✅ 自动显示用户名
- ✅ 返回按钮自动判断页面栈
- ✅ 固定顶部，滚动不影响
- ✅ 适配安全区域

---

## BottomNav - 底部导航

### 🎨 视觉效果
- 纯白背景
- 线性图标风格
- 选中状态顶部指示条
- 图标灰度过滤效果

### 📝 使用方法

```vue
<template>
  <view class="page">
    <!-- 页面内容 -->
    <BottomNav />
  </view>
</template>

<script setup>
import BottomNav from '@/components/BottomNav.vue'
</script>
```

### 🎯 导航项配置

在 `BottomNav.vue` 中配置：

```javascript
const navItems = ref([
  { path: '/pages/home/home', icon: '🏠', text: '首页' },
  { path: '/pages/records/list', icon: '📋', text: '病历' },
  { path: '/pages/chatbot/chat', icon: '💬', text: '咨询' },
  { path: '/pages/my/my', icon: '👤', text: '我的' }
])
```

### 💡 特性

- ✅ 活跃状态顶部蓝色指示条
- ✅ 图标放大和上移动画
- ✅ 灰度过滤效果（未选中）
- ✅ 文字颜色动态变化
- ✅ 适配底部安全区域

### 🎬 动画效果

```scss
/* 顶部指示条滑入动画 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4rpx);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 图标效果 */
.nav-icon {
  filter: grayscale(100%);  /* 未选中：灰度 */
}

.nav-item.active .nav-icon {
  filter: grayscale(0%);    /* 选中：彩色 */
  transform: scale(1.1);     /* 放大 1.1 倍 */
}
```

---

## 用户信息卡片

### 🎨 视觉效果
- 深蓝色渐变背景（`#2870B5` → `#1B5A91`）
- 装饰性毛玻璃背景圆点
- 白色粗体显示核心数据

### 📝 使用代码

```vue
<template>
  <view class="user-card">
    <view class="user-left">
      <view class="avatar">{{ userName.charAt(0) }}</view>
      <view class="user-info">
        <view class="user-name">{{ userName }}</view>
        <view class="user-status">
          <view class="status-dot"></view>
          <text class="status-text">健康状况良好</text>
        </view>
      </view>
    </view>
    <view class="user-right">
      <view class="health-score">
        <view class="score-value">98</view>
        <view class="score-label">健康分</view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.user-card {
  background: linear-gradient(135deg, #2870B5 0%, #1B5A91 100%);
  border-radius: 20rpx;
  padding: 36rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(40, 112, 181, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

/* 装饰性背景圆点 */
.user-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200rpx;
  height: 200rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  filter: blur(40rpx);
}

.avatar {
  width: 104rpx;
  height: 104rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12rpx);
  border: 3rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}

.user-name {
  font-size: 38rpx;
  font-weight: 700;
  color: white;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.health-score {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12rpx);
  border-radius: 18rpx;
  padding: 20rpx 28rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.score-value {
  font-size: 44rpx;
  font-weight: 700;
  color: white;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}
</style>
```

### 💡 设计要点

1. **深蓝渐变**：营造专业医疗氛围
2. **毛玻璃效果**：增加层次感和现代感
3. **白色粗体数据**：健康分数清晰醒目
4. **装饰圆点**：增加视觉趣味性

---

## 快捷功能卡片

### 🎨 视觉效果
- 2x2 Grid 布局
- 主操作卡片使用浅蓝渐变背景
- 图标容器使用蓝色渐变
- 点击时向上移动

### 📝 使用代码

```vue
<template>
  <view class="actions-grid">
    <!-- 主操作卡片（突出显示） -->
    <view class="action-item action-primary" @click="handleClick">
      <view class="action-icon-wrap primary">
        <text class="action-icon">📤</text>
      </view>
      <view class="action-label">上传检查</view>
      <view class="action-desc">AI 智能分析</view>
    </view>
    
    <!-- 普通操作卡片 -->
    <view class="action-item" @click="handleClick">
      <view class="action-icon-wrap">
        <text class="action-icon">📋</text>
      </view>
      <view class="action-label">我的病历</view>
      <view class="action-desc">5 条记录</view>
    </view>
  </view>
</template>

<style scoped>
.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.action-item {
  background: white;
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 2rpx solid transparent;
}

.action-item:active {
  transform: translateY(-4rpx);
  box-shadow: 0 10rpx 28rpx rgba(58, 139, 212, 0.15);
  border-color: #5BA4E0;
}

/* 主操作卡片 - 浅蓝渐变背景 */
.action-item.action-primary {
  background: linear-gradient(135deg, #E8F4FC 0%, #D4EBFA 100%);
  border: 2rpx solid #5BA4E0;
}

.action-icon-wrap.primary {
  background: linear-gradient(135deg, #3A8BD4 0%, #2870B5 100%);
  box-shadow: 0 6rpx 16rpx rgba(58, 139, 212, 0.3);
}
</style>
```

### 💡 布局技巧

```scss
/* Grid 布局自动适配 */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* 2 列等宽 */
  gap: 16rpx;  /* 间距 16rpx */
}
```

---

## 健康数据卡片

### 🎨 视觉效果
- 纯白背景
- 数据分行展示
- 状态标签使用绿色系

### 📝 使用代码

```vue
<template>
  <view class="health-metrics">
    <view class="metric-item">
      <view class="metric-icon">💓</view>
      <view class="metric-content">
        <view class="metric-value">72 <text class="metric-unit">bpm</text></view>
        <view class="metric-label">心率</view>
      </view>
      <view class="metric-status normal">正常</view>
    </view>
    
    <view class="metric-item">
      <view class="metric-icon">🩸</view>
      <view class="metric-content">
        <view class="metric-value">120/80 <text class="metric-unit">mmHg</text></view>
        <view class="metric-label">血压</view>
      </view>
      <view class="metric-status normal">正常</view>
    </view>
  </view>
</template>

<style scoped>
.health-metrics {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.05);
}

.metric-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
}

.metric-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.metric-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.metric-unit {
  font-size: 24rpx;
  font-weight: 400;
  color: #999999;
  margin-left: 4rpx;
}

.metric-status.normal {
  background: #F6FFED;
  color: #52C41A;
  border: 1rpx solid #B7EB8F;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 500;
}
</style>
```

### 💡 状态颜色

```scss
/* 正常 - 绿色 */
.metric-status.normal {
  background: #F6FFED;
  color: #52C41A;
  border: 1rpx solid #B7EB8F;
}

/* 警告 - 橙色 */
.metric-status.warning {
  background: #FFFBE6;
  color: #FAAD14;
  border: 1rpx solid #FFE58F;
}

/* 异常 - 红色 */
.metric-status.danger {
  background: #FFF1F0;
  color: #FF4D4F;
  border: 1rpx solid #FFCCC7;
}
```

---

## 区块标题

### 🎨 视觉效果
- 左侧蓝色渐变装饰条
- 字体加粗，更具权威感
- 右侧"更多"链接

### 📝 使用代码

```vue
<template>
  <view class="section-header">
    <view class="header-title">快捷功能</view>
    <view class="header-more" @click="handleMore">
      <text class="more-text">更多</text>
      <text class="more-icon">→</text>
    </view>
  </view>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.header-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #333333;
  position: relative;
  padding-left: 16rpx;
}

/* 左侧蓝色装饰条 */
.header-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 28rpx;
  background: linear-gradient(180deg, #3A8BD4, #5BA4E0);
  border-radius: 3rpx;
}

.header-more {
  display: flex;
  align-items: center;
  color: #999999;
  font-size: 26rpx;
}

.more-icon {
  margin-left: 4rpx;
  transition: transform 0.3s ease;
}

.header-more:active .more-icon {
  transform: translateX(4rpx);
}
</style>
```

---

## 按钮组件

### 主按钮（Primary Button）

```vue
<template>
  <button class="btn-primary" @click="handleClick">
    确认提交
  </button>
</template>

<style scoped>
.btn-primary {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #3A8BD4 0%, #2870B5 100%);
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(58, 139, 212, 0.25);
  transition: all 0.3s ease;
}

.btn-primary:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(58, 139, 212, 0.2);
}
</style>
```

### 次要按钮（Secondary Button）

```vue
<template>
  <button class="btn-secondary" @click="handleClick">
    取消
  </button>
</template>

<style scoped>
.btn-secondary {
  width: 100%;
  height: 88rpx;
  background: white;
  color: #3A8BD4;
  border: 2rpx solid #3A8BD4;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:active {
  background: #E8F4FC;
}
</style>
```

### 危险按钮（Danger Button）

```vue
<template>
  <button class="btn-danger" @click="handleClick">
    退出登录
  </button>
</template>

<style scoped>
.btn-danger {
  width: 100%;
  height: 88rpx;
  background: white;
  color: #FF4D4F;
  border: 2rpx solid #FFCCC7;
  border-radius: 8rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.12);
  transition: all 0.3s ease;
}

.btn-danger:active {
  background: #FFF1F0;
  transform: translateY(2rpx);
}
</style>
```

---

## 菜单列表

### 🎨 视觉效果
- 纯白背景卡片
- 点击时浅蓝渐变背景
- 箭头颜色动态变化

### 📝 使用代码

```vue
<template>
  <view class="menu-list">
    <view class="menu-item" @click="handleClick">
      <view class="menu-icon">🚨</view>
      <view class="menu-text">紧急联系人</view>
      <view class="menu-arrow">→</view>
    </view>
    
    <view class="menu-item" @click="handleClick">
      <view class="menu-icon">📝</view>
      <view class="menu-text">电子处方</view>
      <view class="menu-arrow">→</view>
    </view>
  </view>
</template>

<style scoped>
.menu-list {
  background: white;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
  transition: all 0.3s ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: linear-gradient(90deg, #E8F4FC 0%, transparent 100%);
  transform: translateX(6rpx);
}

.menu-icon {
  font-size: 42rpx;
  margin-right: 24rpx;
  width: 48rpx;
  text-align: center;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
}

.menu-arrow {
  font-size: 32rpx;
  color: #CCCCCC;
  transition: all 0.3s ease;
}

.menu-item:active .menu-arrow {
  color: #3A8BD4;
  transform: translateX(8rpx);
}
</style>
```

---

## 📋 组件清单

- ✅ AppHeader - 应用头部
- ✅ BottomNav - 底部导航
- ✅ 用户信息卡片 - 深蓝渐变
- ✅ 快捷功能卡片 - Grid 布局
- ✅ 健康数据卡片 - 状态标签
- ✅ 区块标题 - 装饰条
- ✅ 主按钮 - 蓝色渐变
- ✅ 次要按钮 - 白底蓝边
- ✅ 危险按钮 - 红色主题
- ✅ 菜单列表 - 渐变背景

---

**文档版本：** v1.0  
**最后更新：** 2025-10-08



