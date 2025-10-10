# 🎨 医疗助手 - 颜色色板参考

快速查阅项目中使用的所有颜色值。

---

## 主色系（Primary Colors）

| 颜色名称 | HEX 值 | RGB 值 | 用途 |
|---------|--------|--------|------|
| **主色 - 医疗蓝** | `#3A8BD4` | `rgb(58, 139, 212)` | 主按钮、链接、Tab Bar 选中 |
| **深蓝** | `#2870B5` | `rgb(40, 112, 181)` | 渐变终点、Header 背景 |
| **浅蓝** | `#5BA4E0` | `rgb(91, 164, 224)` | 渐变起点、高亮 |
| **极浅蓝** | `#E8F4FC` | `rgb(232, 244, 252)` | 背景色、卡片背景 |
| **更深蓝** | `#1B5A91` | `rgb(27, 90, 145)` | 深色渐变终点 |

### 主色使用示例

```css
/* 主按钮 */
background: linear-gradient(135deg, #3A8BD4 0%, #2870B5 100%);

/* 深色卡片头部 */
background: linear-gradient(135deg, #2870B5 0%, #1B5A91 100%);

/* 浅色背景 */
background: #E8F4FC;
```

---

## 辅助色系（Secondary Colors）

| 颜色名称 | HEX 值 | RGB 值 | 用途 |
|---------|--------|--------|------|
| **成功/健康 - 绿色** | `#52C41A` | `rgb(82, 196, 26)` | 健康状态、成功提示 |
| **成功深绿** | `#389E0D` | `rgb(56, 158, 13)` | 绿色渐变终点 |
| **警告 - 橙色** | `#FAAD14` | `rgb(250, 173, 20)` | 警告提示、注意事项 |
| **错误/危险 - 红色** | `#FF4D4F` | `rgb(255, 77, 79)` | 错误信息、退出按钮 |
| **错误浅红** | `#FFCCC7` | `rgb(255, 204, 199)` | 错误背景、边框 |
| **信息 - 蓝色** | `#1890FF` | `rgb(24, 144, 255)` | 提示信息 |

### 辅助色使用示例

```css
/* 健康状态标签 */
.status-healthy {
  background: #F6FFED;
  color: #52C41A;
  border: 1rpx solid #B7EB8F;
}

/* 退出按钮 */
.btn-danger {
  color: #FF4D4F;
  border: 2rpx solid #FFCCC7;
}
```

---

## 文字颜色（Text Colors）

| 颜色名称 | HEX 值 | RGB 值 | 用途 |
|---------|--------|--------|------|
| **主文字色** | `#333333` | `rgb(51, 51, 51)` | 标题、重要文字 |
| **次要文字色** | `#666666` | `rgb(102, 102, 102)` | 正文、描述 |
| **辅助文字色** | `#999999` | `rgb(153, 153, 153)` | 辅助信息、提示 |
| **禁用文字色** | `#CCCCCC` | `rgb(204, 204, 204)` | 禁用状态文字 |

### 文字颜色层级

```
#333333 (主文字) ← 最重要
    ↓
#666666 (次要文字)
    ↓
#999999 (辅助文字)
    ↓
#CCCCCC (禁用文字) ← 最次要
```

---

## 背景颜色（Background Colors）

| 颜色名称 | HEX 值 | RGB 值 | 用途 |
|---------|--------|--------|------|
| **页面背景** | `#F8F9FA` | `rgb(248, 249, 250)` | 整体页面背景 |
| **卡片背景** | `#FFFFFF` | `rgb(255, 255, 255)` | 卡片、容器背景 |
| **悬停背景** | `#F5F7FA` | `rgb(245, 247, 250)` | 悬停/高亮状态 |
| **禁用背景** | `#F0F0F0` | `rgb(240, 240, 240)` | 禁用状态背景 |

---

## 边框颜色（Border Colors）

| 颜色名称 | HEX 值 | RGB 值 | 用途 |
|---------|--------|--------|------|
| **边框颜色** | `#E8E8E8` | `rgb(232, 232, 232)` | 标准边框 |
| **浅边框** | `#F0F0F0` | `rgb(240, 240, 240)` | 分割线、浅边框 |
| **深边框** | `#D9D9D9` | `rgb(217, 217, 217)` | 强调边框 |

---

## 常用渐变色（Gradients）

### 1. 主渐变（按钮、重要元素）
```css
background: linear-gradient(135deg, #3A8BD4 0%, #2870B5 100%);
```
![#3A8BD4](https://via.placeholder.com/50x20/3A8BD4/FFFFFF?text=+) → ![#2870B5](https://via.placeholder.com/50x20/2870B5/FFFFFF?text=+)

### 2. 深渐变（Header、用户卡片）
```css
background: linear-gradient(135deg, #2870B5 0%, #1B5A91 100%);
```
![#2870B5](https://via.placeholder.com/50x20/2870B5/FFFFFF?text=+) → ![#1B5A91](https://via.placeholder.com/50x20/1B5A91/FFFFFF?text=+)

### 3. 浅渐变（次要元素）
```css
background: linear-gradient(135deg, #5BA4E0 0%, #3A8BD4 100%);
```
![#5BA4E0](https://via.placeholder.com/50x20/5BA4E0/FFFFFF?text=+) → ![#3A8BD4](https://via.placeholder.com/50x20/3A8BD4/FFFFFF?text=+)

### 4. 成功渐变
```css
background: linear-gradient(135deg, #52C41A 0%, #389E0D 100%);
```
![#52C41A](https://via.placeholder.com/50x20/52C41A/FFFFFF?text=+) → ![#389E0D](https://via.placeholder.com/50x20/389E0D/FFFFFF?text=+)

### 5. 警告渐变
```css
background: linear-gradient(135deg, #FAAD14 0%, #D48806 100%);
```
![#FAAD14](https://via.placeholder.com/50x20/FAAD14/000000?text=+) → ![#D48806](https://via.placeholder.com/50x20/D48806/FFFFFF?text=+)

---

## 透明度使用规范

### RGBA 透明度示例

```css
/* 白色透明背景（毛玻璃效果） */
background: rgba(255, 255, 255, 0.2);   /* 20% 不透明度 */
background: rgba(255, 255, 255, 0.25);  /* 25% 不透明度 */
background: rgba(255, 255, 255, 0.4);   /* 40% 不透明度 */
background: rgba(255, 255, 255, 0.8);   /* 80% 不透明度 */
background: rgba(255, 255, 255, 0.9);   /* 90% 不透明度 */

/* 黑色透明阴影 */
box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.05);   /* 5% 不透明度 */
box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);    /* 10% 不透明度 */
box-shadow: 0 10rpx 28rpx rgba(0, 0, 0, 0.15);  /* 15% 不透明度 */

/* 主色透明背景 */
background: rgba(58, 139, 212, 0.1);    /* 浅蓝背景 */
box-shadow: 0 4rpx 12rpx rgba(58, 139, 212, 0.25);  /* 蓝色阴影 */
```

---

## 对比度检查

### WCAG 2.0 AA 级标准

✅ **通过：**
- `#333333` 在 `#FFFFFF` 背景上（对比度 12.6:1）
- `#666666` 在 `#FFFFFF` 背景上（对比度 5.74:1）
- 白色文字在 `#3A8BD4` 背景上（对比度 4.8:1）
- 白色文字在 `#2870B5` 背景上（对比度 6.5:1）

⚠️ **注意：**
- `#999999` 在 `#FFFFFF` 背景上（对比度 2.85:1）- 仅用于辅助信息
- 确保重要文字使用高对比度颜色

---

## 色彩搭配建议

### 1. 卡片配色
```
背景：#FFFFFF
标题：#333333
正文：#666666
辅助：#999999
边框：#E8E8E8
```

### 2. 深色卡片配色
```
背景：linear-gradient(135deg, #2870B5 0%, #1B5A91 100%)
标题：#FFFFFF (font-weight: 700)
正文：rgba(255, 255, 255, 0.9)
边框：rgba(255, 255, 255, 0.4)
```

### 3. 按钮配色
```
主按钮：
  背景：linear-gradient(135deg, #3A8BD4 0%, #2870B5 100%)
  文字：#FFFFFF
  阴影：rgba(58, 139, 212, 0.25)

次要按钮：
  背景：#FFFFFF
  文字：#3A8BD4
  边框：#3A8BD4
  悬停背景：#E8F4FC
```

---

## 快速复制

### SCSS 变量
```scss
// 复制到你的 SCSS 文件
$primary: #3A8BD4;
$primary-dark: #2870B5;
$primary-light: #5BA4E0;
$success: #52C41A;
$warning: #FAAD14;
$error: #FF4D4F;
$text-primary: #333333;
$text-secondary: #666666;
$text-tertiary: #999999;
$bg-page: #F8F9FA;
$bg-card: #FFFFFF;
$border: #E8E8E8;
```

### CSS 变量
```css
/* 复制到你的 CSS 文件 */
:root {
  --primary: #3A8BD4;
  --primary-dark: #2870B5;
  --primary-light: #5BA4E0;
  --success: #52C41A;
  --warning: #FAAD14;
  --error: #FF4D4F;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --bg-page: #F8F9FA;
  --bg-card: #FFFFFF;
  --border: #E8E8E8;
}
```

---

**色板版本：** v1.0  
**最后更新：** 2025-10-08



