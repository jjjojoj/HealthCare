# 🏆 Vant Weapp 最佳实践指南

> 在 HealthCare 项目中使用 Vant Weapp 的最佳实践和开发规范

**创建日期：** 2025-10-08  
**目标：** 统一团队开发规范，提升代码质量

---

## 📋 目录

- [一、组件使用规范](#一组件使用规范)
- [二、性能优化](#二性能优化)
- [三、主题定制](#三主题定制)
- [四、常见问题](#四常见问题)
- [五、代码规范](#五代码规范)

---

## 一、组件使用规范

### 1.1 按需引入

**✅ 推荐做法：在页面级按需引入**

```json
// pages/login/login.json
{
  "usingComponents": {
    "van-button": "@vant/weapp/button/index",
    "van-field": "@vant/weapp/field/index",
    "van-cell-group": "@vant/weapp/cell-group/index"
  }
}
```

**❌ 不推荐：全局引入所有组件**

```json
// app.json（不推荐）
{
  "usingComponents": {
    "van-button": "@vant/weapp/button/index",
    "van-field": "@vant/weapp/field/index",
    // ... 引入所有组件会增加包体积
  }
}
```

**💡 建议：**
- 只在页面中引入需要的组件
- 如果多个页面都用到某个组件，可以在 `app.json` 中全局引入
- 定期检查并移除未使用的组件引入

---

### 1.2 组件命名

**✅ 推荐：使用 van- 前缀**

```vue
<template>
  <van-button type="primary">按钮</van-button>
  <van-cell title="单元格" />
</template>
```

**❌ 不推荐：修改组件名称**

```json
// 不要这样做
{
  "usingComponents": {
    "my-button": "@vant/weapp/button/index"  // ❌
  }
}
```

---

### 1.3 Props 传递

**✅ 推荐：使用动态绑定和明确的类型**

```vue
<template>
  <!-- 布尔值 -->
  <van-button :disabled="isDisabled" />
  
  <!-- 数字 -->
  <van-progress :percentage="progress" />
  
  <!-- 字符串（可省略冒号） -->
  <van-button type="primary" />
  
  <!-- 对象 -->
  <van-field :rules="rules" />
</template>

<script setup>
import { ref } from 'vue'

const isDisabled = ref(false)
const progress = ref(50)
const rules = ref([
  { required: true, message: '请填写必填项' }
])
</script>
```

**❌ 不推荐：类型混乱**

```vue
<!-- ❌ 布尔值应该用动态绑定 -->
<van-button disabled="false" />  <!-- 这会被当作 true -->

<!-- ❌ 数字应该用动态绑定 -->
<van-progress percentage="50" />  <!-- 这是字符串 -->
```

---

### 1.4 事件处理

**✅ 推荐：使用 @ 语法绑定事件**

```vue
<template>
  <van-button @click="handleClick">点击</van-button>
  
  <van-field 
    v-model="value"
    @input="onInput"
    @blur="onBlur"
  />
</template>

<script setup>
const handleClick = () => {
  console.log('按钮被点击')
}

const onInput = (event) => {
  console.log('输入:', event.detail)
}

const onBlur = () => {
  console.log('失去焦点')
}
</script>
```

---

### 1.5 插槽使用

**✅ 推荐：合理使用具名插槽**

```vue
<template>
  <van-cell title="基本信息">
    <template #icon>
      <van-icon name="info-o" class="custom-icon" />
    </template>
    
    <template #right-icon>
      <van-tag type="primary">新</van-tag>
    </template>
  </van-cell>
</template>

<style scoped>
.custom-icon {
  margin-right: 16rpx;
  color: #3A8BD4;
}
</style>
```

---

## 二、性能优化

### 2.1 组件懒加载

对于不在首屏展示的组件，使用条件渲染：

```vue
<template>
  <view>
    <!-- 首屏内容 -->
    <view class="hero">...</view>
    
    <!-- 懒加载的内容 -->
    <view v-if="showMore">
      <van-tabs v-model:active="activeTab">
        <!-- 大量内容 -->
      </van-tabs>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showMore = ref(false)

onMounted(() => {
  // 延迟加载非首屏内容
  setTimeout(() => {
    showMore.value = true
  }, 300)
})
</script>
```

---

### 2.2 列表优化

**使用虚拟列表处理大数据：**

```vue
<template>
  <!-- 数据量小（<100条）：直接渲染 -->
  <van-cell-group v-if="records.length < 100">
    <van-cell 
      v-for="record in records"
      :key="record.id"
      :title="record.title"
    />
  </van-cell-group>
  
  <!-- 数据量大：分页加载 -->
  <van-list
    v-else
    v-model:loading="loading"
    :finished="finished"
    @load="onLoad"
  >
    <van-cell 
      v-for="record in displayRecords"
      :key="record.id"
      :title="record.title"
    />
  </van-list>
</template>

<script setup>
import { ref } from 'vue'

const records = ref([])
const displayRecords = ref([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)

const onLoad = () => {
  // 模拟分页加载
  setTimeout(() => {
    const start = (page.value - 1) * 20
    const end = start + 20
    const newRecords = records.value.slice(start, end)
    
    displayRecords.value.push(...newRecords)
    loading.value = false
    
    if (end >= records.value.length) {
      finished.value = true
    } else {
      page.value++
    }
  }, 500)
}
</script>
```

---

### 2.3 图片优化

**使用 Vant Icon 替代图片图标：**

```vue
<template>
  <!-- ❌ 不推荐：使用图片 -->
  <image src="/static/icons/home.png" class="icon" />
  
  <!-- ✅ 推荐：使用 Vant Icon -->
  <van-icon name="wap-home-o" class="icon" />
</template>

<style scoped>
.icon {
  font-size: 32rpx;
  color: #3A8BD4;
}
</style>
```

**优势：**
- 体积更小（字体 vs 图片）
- 颜色可控
- 更清晰（矢量 vs 位图）
- 减少 HTTP 请求

---

## 三、主题定制

### 3.1 使用 CSS 变量

**在 `app.vue` 或全局样式中定义主题变量：**

```vue
<!-- app.vue -->
<style>
@import '@/styles/vant-theme.scss';

page {
  /* 覆盖 Vant 默认变量 */
  --button-primary-background-color: #3A8BD4;
  --button-primary-border-color: #3A8BD4;
  --cell-active-color: #3A8BD4;
}
</style>
```

---

### 3.2 组件级样式定制

**使用 scoped 样式覆盖组件样式：**

```vue
<template>
  <van-button type="primary" class="custom-button">
    自定义按钮
  </van-button>
</template>

<style scoped>
.custom-button {
  /* 增强主按钮样式 */
  background: linear-gradient(135deg, #3A8BD4 0%, #2870B5 100%) !important;
  box-shadow: 0 4rpx 12rpx rgba(58, 139, 212, 0.25);
  border: none;
}

.custom-button::after {
  border: none;
}
</style>
```

---

### 3.3 保持一致性

**创建统一的主题配置文件：**

```scss
// src/styles/vant-theme.scss
page {
  // 主色调统一使用医疗蓝
  --primary-color: #3A8BD4;
  --button-primary-background-color: #3A8BD4;
  --tab-active-text-color: #3A8BD4;
  --checkbox-checked-icon-color: #3A8BD4;
  // ... 更多变量
}
```

**在所有页面中导入：**

```vue
<!-- 每个页面 -->
<style>
@import '@/styles/vant-theme.scss';
</style>
```

---

## 四、常见问题

### 4.1 样式不生效

**问题：** Vant 组件样式没有生效

**解决方案：**

1. 确保正确引入组件
2. 检查 CSS 变量是否正确设置
3. 使用 `!important` 覆盖默认样式（谨慎使用）
4. 检查是否有其他样式冲突

```vue
<style scoped>
/* 使用深度选择器 */
:deep(.van-button) {
  border-radius: 20rpx;
}

/* 或使用 !important */
.custom-button {
  border-radius: 20rpx !important;
}
</style>
```

---

### 4.2 事件不触发

**问题：** 组件事件没有触发

**解决方案：**

1. 检查事件名称是否正确（参考官方文档）
2. 确保使用 `@` 而不是 `bind:`
3. 检查是否有其他元素遮挡

```vue
<!-- ✅ 正确 -->
<van-button @click="handleClick">点击</van-button>

<!-- ❌ 错误（小程序原生语法，不适用 Vue） -->
<van-button bindclick="handleClick">点击</van-button>
```

---

### 4.3 数据绑定问题

**问题：** `v-model` 不工作

**解决方案：**

```vue
<template>
  <!-- ✅ 正确：使用 v-model -->
  <van-field v-model="value" />
  
  <!-- ✅ 也可以拆分写 -->
  <van-field 
    :value="value"
    @input="value = $event.detail"
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
</script>
```

---

### 4.4 图标不显示

**问题：** Vant Icon 不显示

**解决方案：**

1. 确保引入了 `van-icon` 组件
2. 检查图标名称是否正确
3. 查看 [Vant Icon 列表](https://vant.pro/vant-weapp/#/icon)

```json
// 页面配置
{
  "usingComponents": {
    "van-icon": "@vant/weapp/icon/index"
  }
}
```

```vue
<!-- 使用正确的图标名称 -->
<van-icon name="success" />
<van-icon name="cross" />
<van-icon name="info-o" />
```

---

## 五、代码规范

### 5.1 组件引入顺序

```vue
<template>
  <!-- 1. Vant 组件 -->
  <van-button type="primary">按钮</van-button>
  
  <!-- 2. 自定义业务组件 -->
  <app-header title="标题" />
  
  <!-- 3. 原生标签 -->
  <view class="container">内容</view>
</template>
```

---

### 5.2 命名规范

**组件：** PascalCase

```javascript
// components/RecordCard/index.vue
export default {
  name: 'RecordCard'
}
```

**变量和函数：** camelCase

```javascript
const userName = ref('')
const handleSubmit = () => {}
```

**常量：** UPPER_SNAKE_CASE

```javascript
const MAX_RETRY_COUNT = 3
const API_BASE_URL = 'https://api.example.com'
```

**CSS 类名：** kebab-case

```scss
.user-info-card {
  .user-name { }
  .user-avatar { }
}
```

---

### 5.3 文件组织

```
components/RecordCard/
├── index.vue           # 组件主文件
├── index.scss          # 组件样式（如果很大）
├── README.md           # 组件文档
└── types.ts            # TypeScript 类型定义（如果使用 TS）
```

---

### 5.4 注释规范

**组件注释：**

```vue
<template>
  <!-- 用户信息卡片：展示用户基本信息和健康评分 -->
  <view class="user-card">
    ...
  </view>
</template>

<script setup>
/**
 * 用户信息卡片组件
 * @description 展示用户基本信息、健康评分和快捷操作
 */

/**
 * 获取健康评分的颜色
 * @param {number} score - 健康评分 (0-100)
 * @returns {string} 颜色值
 */
const getScoreColor = (score) => {
  if (score >= 80) return '#52C41A'  // 绿色
  if (score >= 60) return '#FAAD14'  // 橙色
  return '#FF4D4F'                   // 红色
}
</script>
```

---

### 5.5 代码格式化

**使用 ESLint + Prettier 自动格式化：**

```bash
# 检查代码规范
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format
```

**配置编辑器：**

在 VS Code 中设置保存时自动格式化：

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 六、开发工作流

### 6.1 开发新页面的步骤

1. **创建页面文件**
   ```bash
   src/pages/new-page/
   ├── new-page.vue
   └── new-page.json
   ```

2. **在 pages.json 中注册**
   ```json
   {
     "pages": [
       {
         "path": "pages/new-page/new-page",
         "style": {
           "navigationBarTitleText": "新页面"
         }
       }
     ]
   }
   ```

3. **引入需要的 Vant 组件**
   ```json
   // new-page.json
   {
     "usingComponents": {
       "van-button": "@vant/weapp/button/index",
       "van-cell": "@vant/weapp/cell/index"
     }
   }
   ```

4. **编写页面代码**
   ```vue
   <template>
     <view class="new-page">
       <van-button type="primary">按钮</van-button>
     </view>
   </template>
   
   <script setup>
   // 页面逻辑
   </script>
   
   <style scoped>
   @import '@/styles/vant-theme.scss';
   
   .new-page {
     padding: 32rpx;
   }
   </style>
   ```

5. **测试和优化**
   - 运行 `npm run dev` 测试
   - 检查样式和交互
   - 运行 `npm run lint` 检查代码规范

---

### 6.2 开发新组件的步骤

1. **创建组件目录**
   ```bash
   src/components/business/NewComponent/
   ├── index.vue
   └── README.md
   ```

2. **编写组件**
   ```vue
   <template>
     <view class="new-component">
       <!-- 组件内容 -->
     </view>
   </template>
   
   <script setup>
   defineProps({
     title: {
       type: String,
       default: ''
     }
   })
   
   defineEmits(['click'])
   </script>
   ```

3. **编写组件文档**
   ```markdown
   # NewComponent
   
   ## 介绍
   组件说明...
   
   ## 使用
   \`\`\`vue
   <new-component title="标题" @click="handleClick" />
   \`\`\`
   
   ## API
   ...
   ```

4. **在页面中使用**
   ```vue
   <template>
     <new-component title="标题" @click="handleClick" />
   </template>
   
   <script setup>
   import NewComponent from '@/components/business/NewComponent'
   </script>
   ```

---

## 七、性能监控

### 7.1 性能指标

定期检查以下指标：

- **包体积**：`npm run build` 后查看 `dist/` 大小
- **首屏加载时间**：使用浏览器开发者工具测量
- **组件渲染时间**：使用 Vue Devtools
- **内存占用**：使用浏览器性能分析工具

---

### 7.2 优化建议

1. **减少包体积**
   - 只引入需要的组件
   - 删除未使用的代码
   - 压缩图片资源

2. **优化渲染性能**
   - 使用 `v-if` 而不是 `v-show` 对于初始不显示的内容
   - 避免深层嵌套
   - 合理使用 `key` 属性

3. **优化网络请求**
   - 合并请求
   - 使用缓存
   - 懒加载非关键资源

---

## 📚 参考资源

- [Vant Weapp 官方文档](https://vant.pro/vant-weapp/)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [ESLint 规则](https://eslint.org/docs/rules/)
- [Prettier 配置](https://prettier.io/docs/en/options.html)

---

## 📝 更新日志

| 日期 | 版本 | 说明 |
|------|------|------|
| 2025-10-08 | v1.0 | 初始版本 |

---

**最后更新：** 2025-10-08  
**文档版本：** v1.0  
**维护者：** HealthCare Team


