# 🎨 首页重新设计说明

## 设计改动

### ✅ 原来的设计
- 用户信息卡片在顶部
- 快捷功能横向排列（3个）
- 健康仪表盘在底部

### 🎯 新的设计
- 用户信息卡片保持在顶部
- **主要内容区域改为左右布局**：
  - **左侧**：健康综合评分卡片（固定宽度 300rpx）
  - **右侧**：快捷功能纵向排列（3个卡片）
- 健康仪表盘改为全宽显示在下方

---

## 🆕 新增组件：HealthScoreCard

### 组件位置
`src/components/HealthScoreCard.vue`

### 功能特性

#### 1. **圆形进度环**
- ✅ Canvas 绘制的渐变色进度环
- ✅ 动画效果：1秒内从 0 绘制到目标分数
- ✅ 绿色渐变（#37CD87 → #2DB873 → #25A563）
- ✅ 光晕阴影效果

#### 2. **评分显示**
- ✅ 大号渐变色数字（72rpx）
- ✅ "综合评分" 标签
- ✅ 居中显示在圆环内

#### 3. **等级评定**
- ✅ 根据分数自动显示等级：
  - 90-100：⭐ 优秀（金色背景）
  - 80-89：😊 良好（青色背景）
  - 70-79：😐 一般（蓝色背景）
  - <70：⚠️ 需改善（红色背景）

#### 4. **健康指标列表**
- ✅ 心率 - 正常 ✅
- ✅ 血压 - 正常 ✅
- ✅ 血糖 - 良好 🔵
- ✅ BMI - 标准 ✅
- 每个指标有彩色圆点和状态文字

#### 5. **趋势提示**
- ✅ 显示较上周的变化
- ✅ 上升/下降图标
- ✅ 变化文字说明

---

## 🎨 视觉设计

### 配色方案

| 元素 | 颜色 | 用途 |
|------|------|------|
| 主渐变 | #37CD87 → #25A563 | 进度环 |
| 背景渐变 | #ffffff → #f8fff8 | 卡片背景 |
| 优秀等级 | #fff7e6 + #ffd591 | 90+ 分 |
| 良好等级 | #e6fffb + #87e8de | 80-89 分 |
| 一般等级 | #e6f7ff + #91d5ff | 70-79 分 |
| 警告等级 | #fff1f0 + #ffccc7 | <70 分 |

### 圆角规范
- 卡片外框：24rpx
- 等级标签：16rpx
- 趋势提示：12rpx
- 进度环图标：18rpx

### 阴影效果
- 卡片阴影：`0 8rpx 24rpx rgba(55, 205, 135, 0.12)`
- 进度环光晕：`0 0 10rpx rgba(37, 165, 99, 0.3)`
- 圆点阴影：`0 0 8rpx currentColor`

---

## 📐 布局调整

### 响应式设计
```scss
// 桌面/平板（横屏）
.main-content {
  display: flex;  // 左右布局
  gap: 20rpx;
}

.left-section {
  width: 300rpx;  // 固定宽度
}

.right-section {
  flex: 1;  // 自适应剩余空间
}

// 手机（小屏幕）
@media (max-width: 750rpx) {
  .main-content {
    flex-direction: column;  // 改为垂直布局
  }

  .left-section {
    width: 100%;  // 全宽
  }
}
```

### 快捷功能卡片
**原来**：横向 3 个小卡片
```
[上传] [用药] [分析]
```

**现在**：纵向 3 个大卡片
```
┌──────────────────────┐
│ ↑  上传检查          │
│    AI智能分析        │
└──────────────────────┘
┌──────────────────────┐
│ +  用药助手          │
│    智能提醒          │
└──────────────────────┘
┌──────────────────────┐
│ ≡  健康分析          │
│    数据洞察          │
└──────────────────────┘
```

---

## 🎬 动画效果

### 进度环动画
```javascript
// 1秒内从 0 → 目标分数
const animationDuration = 1000
const frameRate = 60
// 使用 requestAnimationFrame 实现流畅动画
```

### 卡片交互
```scss
.action-card:active {
  transform: translateX(4rpx);  // 向右位移
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.1);  // 增强阴影
}
```

---

## 📱 组件使用

### 在首页中使用
```vue
<template>
  <view class="main-content">
    <!-- 左侧：健康评分 -->
    <view class="left-section">
      <HealthScoreCard :score="85" />
    </view>

    <!-- 右侧：快捷功能 -->
    <view class="right-section">
      <!-- ... 快捷功能卡片 ... -->
    </view>
  </view>
</template>

<script setup>
import HealthScoreCard from '@/components/HealthScoreCard.vue'
</script>
```

### Props 配置
```javascript
props: {
  score: {
    type: Number,
    default: 85  // 综合评分（0-100）
  },
  canvasId: {
    type: String,
    default: 'scoreCanvas'  // Canvas ID（避免重复）
  }
}
```

---

## 🔧 技术实现

### Canvas 绘制
```javascript
// 1. 创建 Canvas 上下文
const ctx = uni.createCanvasContext(canvasId)

// 2. 绘制背景圆环
ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)

// 3. 创建渐变色
const gradient = ctx.createLinearGradient(0, 0, 150, 150)
gradient.addColorStop(0, '#37CD87')
gradient.addColorStop(1, '#25A563')

// 4. 绘制进度环（带动画）
ctx.arc(centerX, centerY, radius, -Math.PI/2, endAngle)

// 5. 添加光晕
ctx.setShadow(0, 0, 10, 'rgba(37, 165, 99, 0.3)')

// 6. 渲染到画布
ctx.draw()
```

### 计算属性
```javascript
// 根据分数自动计算等级
const gradeClass = computed(() => {
  if (score >= 90) return 'grade-excellent'
  if (score >= 80) return 'grade-good'
  if (score >= 70) return 'grade-normal'
  return 'grade-warning'
})
```

---

## 📊 数据结构

### 健康指标
```javascript
const indicators = [
  { name: '心率', status: '正常', color: '#52c41a' },
  { name: '血压', status: '正常', color: '#52c41a' },
  { name: '血糖', status: '良好', color: '#1890ff' },
  { name: 'BMI', status: '标准', color: '#52c41a' }
]
```

### 趋势数据
```javascript
{
  trendClass: 'trend-up',  // trend-up | trend-down
  trendIcon: '↑',          // ↑ | ↓
  trendText: '较上周提升 3 分'
}
```

---

## 🎯 优势

### 1. **更突出的评分展示**
- 圆形进度环更吸引眼球
- 动画效果增加趣味性
- 等级评定一目了然

### 2. **更合理的空间利用**
- 左侧评分卡片独立显示
- 右侧快捷功能纵向排列，更易点击
- 整体布局更平衡

### 3. **更好的用户体验**
- 响应式设计适配多种屏幕
- 清晰的视觉层级
- 流畅的动画过渡

### 4. **更丰富的信息展示**
- 综合评分
- 健康等级
- 各项指标状态
- 趋势变化
- 快捷操作

---

## 📸 视觉效果

### 布局示意图
```
┌─────────────────────────────────────────┐
│  用户信息卡片 (绿色渐变)                  │
└─────────────────────────────────────────┘

┌──────────────┐  ┌─────────────────────┐
│              │  │ ↑ 上传检查           │
│   ⭕ 85      │  │   AI智能分析         │
│  综合评分     │  └─────────────────────┘
│              │  ┌─────────────────────┐
│  😊 良好     │  │ + 用药助手           │
│              │  │   智能提醒           │
│  ✅ 心率正常  │  └─────────────────────┘
│  ✅ 血压正常  │  ┌─────────────────────┐
│  🔵 血糖良好  │  │ ≡ 健康分析           │
│  ✅ BMI标准   │  │   数据洞察           │
│              │  └─────────────────────┘
│  ↑ 提升3分   │
└──────────────┘

┌─────────────────────────────────────────┐
│  健康仪表盘                               │
│  (心率/血压/血糖/BMI 可视化图表)           │
└─────────────────────────────────────────┘
```

---

## 🚀 后续优化建议

1. **数据动态化**
   - 从 API 获取真实健康评分
   - 根据历史数据计算趋势

2. **更多交互**
   - 点击评分卡片查看详细报告
   - 长按显示各项指标说明

3. **个性化**
   - 根据用户健康目标调整指标权重
   - 自定义显示的健康指标

4. **通知提醒**
   - 当评分下降时发送提醒
   - 定期健康检查提示

---

**设计完成时间：** 2025-10-10
**组件文件：** [src/components/HealthScoreCard.vue](src/components/HealthScoreCard.vue)
**修改文件：** [src/pages/home/home.vue](src/pages/home/home.vue)
