# 医疗助手 - UI 设计指南

> 蓝色主题 | 简洁易用 | 专业高级感

---

## 📋 目录

1. [设计理念](#设计理念)
2. [主题色彩](#主题色彩)
3. [组件规范](#组件规范)
4. [使用示例](#使用示例)
5. [最佳实践](#最佳实践)

---

## 🎨 设计理念

### 核心原则

- **医疗专业性**：使用医疗行业标准的蓝色系，传递信任和专业感
- **简洁易用**：界面清晰，操作直观，减少用户认知负担
- **高级感**：精致的渐变、阴影和动画，提升品质感
- **一致性**：统一的设计语言，确保用户体验连贯

### 设计目标

1. ✅ 适配 H5 和微信小程序
2. ✅ 响应式布局，适应不同屏幕
3. ✅ 高可读性和可访问性
4. ✅ 流畅的交互反馈

---

## 🎨 主题色彩

### 主色系（Primary Colors）

```scss
$primary-color: #3A8BD4;      // 主色 - 医疗蓝
$primary-dark: #2870B5;       // 深蓝
$primary-light: #5BA4E0;      // 浅蓝
$primary-lighter: #E8F4FC;    // 极浅蓝（背景用）
```

**使用场景：**
- 主按钮、链接、重要操作
- Header 头部导航
- Tab Bar 选中状态
- 重点信息标识

### 辅助色系（Secondary Colors）

```scss
$success-color: #52C41A;      // 成功/健康 - 绿色
$warning-color: #FAAD14;      // 警告 - 橙色
$error-color: #FF4D4F;        // 错误/危险 - 红色
$info-color: #1890FF;         // 信息 - 蓝色
```

**使用场景：**
- 健康状态标签（绿色）
- 警告提示（橙色）
- 错误信息、退出按钮（红色）
- 提示信息（蓝色）

### 中性色系（Neutral Colors）

```scss
// 文字颜色
$text-primary: #333333;       // 主文字色
$text-secondary: #666666;     // 次要文字色
$text-tertiary: #999999;      // 辅助文字色
$text-disabled: #CCCCCC;      // 禁用文字色

// 背景色
$bg-page: #F8F9FA;           // 页面背景 - 极浅灰
$bg-card: #FFFFFF;           // 卡片背景 - 纯白
$bg-hover: #F5F7FA;          // 悬停背景
$bg-disabled: #F0F0F0;       // 禁用背景

// 边框色
$border-color: #E8E8E8;      // 边框颜色
$border-light: #F0F0F0;      // 浅边框
$border-dark: #D9D9D9;       // 深边框
```

### 渐变色（Gradients）

```scss
// 主渐变 - 按钮、卡片头部
$gradient-primary: linear-gradient(135deg, #3A8BD4 0%, #2870B5 100%);

// 浅渐变 - 次要元素
$gradient-primary-light: linear-gradient(135deg, #5BA4E0 0%, #3A8BD4 100%);

// 深渐变 - Header、用户卡片
$gradient-card-header: linear-gradient(135deg, #2870B5 0%, #1B5A91 100%);

// 成功渐变
$gradient-success: linear-gradient(135deg, #52C41A 0%, #389E0D 100%);
```

---

## 📐 组件规范

### 1. 卡片（Card）

#### 基础卡片样式

```scss
.card {
  background: #FFFFFF;
  border-radius: 12rpx;
  padding: 32rpx;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card:active {
  transform: translateY(-2rpx);
  box-shadow: 0 10rpx 28rpx rgba(0, 0, 0, 0.08);
}
```

#### 使用场景
- 信息展示卡片
- 功能入口卡片
- 数据统计卡片

### 2. 按钮（Button）

#### 主按钮（Primary Button）

```scss
.btn-primary {
  background: linear-gradient(135deg, #3A8BD4 0%, #2870B5 100%);
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 24rpx 32rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(58, 139, 212, 0.25);
  transition: all 0.3s ease;
}

.btn-primary:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 8rpx rgba(58, 139, 212, 0.2);
}
```

#### 次要按钮（Secondary Button）

```scss
.btn-secondary {
  background: white;
  color: #3A8BD4;
  border: 2rpx solid #3A8BD4;
  border-radius: 8rpx;
  padding: 24rpx 32rpx;
  font-weight: 500;
}

.btn-secondary:active {
  background: #E8F4FC;
}
```

### 3. 圆角规范（Border Radius）

```scss
$radius-sm: 8rpx;     // 小圆角 - 按钮
$radius-md: 12rpx;    // 中圆角 - 卡片
$radius-lg: 20rpx;    // 大圆角 - 主要卡片
$radius-xl: 24rpx;    // 超大圆角 - 特殊卡片
$radius-round: 50%;   // 圆形 - 头像
```

### 4. 阴影规范（Box Shadow）

```scss
// 卡片阴影
$shadow-card: 0 6rpx 18rpx rgba(0, 0, 0, 0.05);
$shadow-card-hover: 0 10rpx 28rpx rgba(0, 0, 0, 0.08);

// 按钮阴影
$shadow-button: 0 4rpx 12rpx rgba(58, 139, 212, 0.25);
$shadow-button-hover: 0 6rpx 16rpx rgba(58, 139, 212, 0.35);

// Header 阴影
$shadow-header: 0 4rpx 16rpx rgba(58, 139, 212, 0.2);
```

### 5. 字体规范（Typography）

```scss
// 字体大小
$font-size-xs: 22rpx;
$font-size-sm: 24rpx;
$font-size-base: 28rpx;
$font-size-md: 30rpx;
$font-size-lg: 32rpx;
$font-size-xl: 36rpx;
$font-size-xxl: 40rpx;
$font-size-huge: 48rpx;

// 字体粗细
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### 6. 间距规范（Spacing）

```scss
$spacing-xs: 8rpx;
$spacing-sm: 12rpx;
$spacing-md: 16rpx;
$spacing-lg: 24rpx;
$spacing-xl: 32rpx;
$spacing-xxl: 48rpx;
```

---

## 💡 使用示例

### 示例 1: 深蓝色用户信息卡片

```vue
<template>
  <view class="user-card">
    <view class="avatar">{{ userName.charAt(0) }}</view>
    <view class="user-info">
      <view class="user-name">{{ userName }}</view>
      <view class="user-status">健康状况良好</view>
    </view>
    <view class="health-score">
      <view class="score-value">98</view>
      <view class="score-label">健康分</view>
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
  position: relative;
  overflow: hidden;
}

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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  font-weight: 700;
  color: white;
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
  text-align: center;
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

### 示例 2: 区块标题（带装饰条）

```vue
<template>
  <view class="section-header">
    <view class="header-title">快捷功能</view>
    <view class="header-more">
      <text>更多</text>
      <text class="arrow">→</text>
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
</style>
```

### 示例 3: BottomNav 活跃状态指示器

```vue
<style scoped>
.nav-item {
  position: relative;
}

/* 顶部指示条 */
.nav-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #3A8BD4, #5BA4E0);
  border-radius: 0 0 4rpx 4rpx;
  animation: slideDown 0.3s ease;
}

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

.nav-icon {
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.nav-item.active .nav-icon {
  filter: grayscale(0%);
  transform: scale(1.1);
}

.nav-text {
  color: #999999;
}

.nav-item.active .nav-text {
  color: #3A8BD4;
  font-weight: 600;
}
</style>
```

---

## ✅ 最佳实践

### 1. 颜色使用

✅ **推荐：**
- 主色用于重要操作和重点信息
- 深蓝渐变用于头部和重要卡片
- 白色粗体显示核心健康数据

❌ **避免：**
- 过度使用渐变色
- 纯黑色文字（使用 `#333333`）
- 低对比度的文字颜色组合

### 2. 圆角使用

✅ **推荐：**
- 按钮：8rpx（轻微圆角，避免尖锐）
- 卡片：12rpx（柔和舒适）
- 特殊卡片：20rpx（突出重点）

❌ **避免：**
- 直角（0rpx）显得生硬
- 过大圆角（>30rpx）失去专业感

### 3. 阴影使用

✅ **推荐：**
- 使用柔和的阴影：`0 6rpx 18rpx rgba(0, 0, 0, 0.05)`
- 悬停时增强阴影
- 保持一致的阴影风格

❌ **避免：**
- 过重的阴影
- 多重阴影叠加
- 彩色阴影

### 4. 动画和过渡

✅ **推荐：**
- 使用 `transition: all 0.3s ease`
- 按钮点击时轻微位移
- 图标缩放和颜色变化

❌ **避免：**
- 过长的动画时长（>0.5s）
- 复杂的关键帧动画
- 影响性能的动画

### 5. 响应式设计

✅ **推荐：**
- 使用 rpx 单位
- Grid 布局自动适配
- 图片使用百分比宽度

❌ **避免：**
- 固定像素值（px）
- 硬编码尺寸
- 不考虑安全区域

---

## 🔧 主题文件位置

```
src/
├── styles/
│   └── theme.scss          # 全局主题变量和 Mixin
├── static/
│   └── index.css           # 全局 CSS 样式
└── components/
    ├── AppHeader.vue       # 头部组件
    └── BottomNav.vue       # 底部导航
```

---

## 📚 参考资源

- [UniApp 官方文档](https://uniapp.dcloud.net.cn/)
- [CSS Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Material Design Color System](https://material.io/design/color)

---

**文档版本：** v1.0  
**最后更新：** 2025-10-08  
**维护者：** HealthCare Team

