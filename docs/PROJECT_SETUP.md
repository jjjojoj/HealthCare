# 项目配置说明

本文档介绍项目的配置和优化内容。

## 📦 环境变量配置

项目支持多环境配置，配置文件如下：

### 1. 环境变量文件

- `.env` - 通用环境变量
- `.env.development` - 开发环境
- `.env.test` - 测试环境
- `.env.production` - 生产环境

### 2. 环境变量说明

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_APP_TITLE` | 应用标题 | 远程医疗系统 |
| `VITE_API_BASE_URL` | API 基础路径 | http://localhost:3000/api |
| `VITE_API_TIMEOUT` | API 超时时间（毫秒） | 30000 |
| `VITE_USE_MOCK` | 是否使用 Mock 数据 | true/false |
| `VITE_WEIXIN_APPID` | 微信小程序 AppID | wx1234567890abcdef |
| `VITE_SHOW_DEBUG` | 是否显示调试信息 | true/false |

### 3. 在代码中使用

```javascript
// 方式一：直接使用
const apiUrl = import.meta.env.VITE_API_BASE_URL

// 方式二：通过配置文件
import config from '@/config'
const apiUrl = config.apiBaseUrl
```

## 🛠️ Vite 配置优化

### 1. 路径别名

```javascript
import component from '@/components/MyComponent.vue'
import api from '@/api'
import utils from '@/utils'
import store from '@/store'
```

支持的别名：
- `@` → `src/`
- `@components` → `src/components/`
- `@pages` → `src/pages/`
- `@utils` → `src/utils/`
- `@api` → `src/api/`
- `@styles` → `src/styles/`
- `@static` → `src/static/`
- `@store` → `src/store/`

### 2. API 代理配置

开发环境自动代理 `/api` 请求到配置的后端服务器，避免跨域问题。

```javascript
// 请求 /api/user/login 会自动代理到 http://localhost:3000/user/login
fetch('/api/user/login')
```

### 3. 构建优化

- 自动压缩代码
- 生产环境移除 console 和 debugger
- chunk 大小警告限制

## 📁 项目目录结构

```
src/
├── api/                  # API 接口
│   ├── user.js          # 用户相关
│   ├── appointment.js   # 预约相关
│   ├── consultation.js  # 问诊相关
│   ├── health.js        # 健康档案相关
│   └── index.js         # 统一导出
├── components/          # 公共组件
├── composables/         # 组合式 API
│   └── useSystemInfo.js # 系统信息
├── config/              # 配置文件
│   └── index.js         # 主配置
├── pages/               # 页面
├── static/              # 静态资源
├── store/               # 状态管理
├── styles/              # 样式文件
└── utils/               # 工具函数
    ├── request.js       # 网络请求
    ├── storage.js       # 本地存储
    ├── validator.js     # 数据验证
    ├── date.js          # 日期处理
    ├── responsive.js    # 响应式适配
    └── index.js         # 工具函数集合
```

## 🌐 网络请求封装

### 1. 基础用法

```javascript
import { get, post, put, del } from '@/utils/request'

// GET 请求
const data = await get('/user/info')

// POST 请求
const result = await post('/user/login', { username, password })

// PUT 请求
await put('/user/info', { nickname: '张三' })

// DELETE 请求
await del('/user/account')
```

### 2. 高级选项

```javascript
// 自定义配置
const data = await get('/api/data', params, {
  showLoading: false,    // 不显示加载提示
  showError: false,      // 不显示错误提示
  loadingText: '请稍候...', // 自定义加载文案
  allowDuplicate: true   // 允许重复请求
})
```

### 3. 文件上传

```javascript
import { upload } from '@/utils/request'

const result = await upload('/upload', filePath, {
  type: 'avatar'
})
```

### 4. 文件下载

```javascript
import { download } from '@/utils/request'

const tempFilePath = await download('/file/download?id=123')
```

## 🔧 工具函数

### 1. 数据验证

```javascript
import validator from '@/utils/validator'

validator.phone('13800138000')      // 验证手机号
validator.email('test@example.com')  // 验证邮箱
validator.idCard('110101199001011234') // 验证身份证
validator.password('abc123')         // 验证密码强度
```

### 2. 日期处理

```javascript
import date from '@/utils/date'

date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
date.relative(timestamp)             // 获取相对时间（如：5分钟前）
date.calculateAge('1990-01-01')      // 计算年龄
date.getWeekDay(new Date())          // 获取星期几
```

### 3. 本地存储

```javascript
import storage from '@/utils/storage'

storage.set('key', 'value')          // 设置
storage.get('key')                   // 获取
storage.remove('key')                // 移除
storage.clear()                      // 清空
```

### 4. 响应式适配

```javascript
import responsive from '@/utils/responsive'

// 获取系统信息
const info = responsive.getPlatformInfo()

// 获取导航栏高度
const navBarHeight = responsive.getNavBarHeight()

// 获取底部安全区域高度
const safeBottom = responsive.getSafeAreaBottom()

// 判断是否为 iPhone X
if (responsive.isIPhoneX()) {
  // 特殊处理
}
```

### 5. 在 Vue 组件中使用

```vue
<script setup>
import { useSystemInfo } from '@/composables/useSystemInfo'

const {
  statusBarHeight,
  navBarHeight,
  safeAreaBottom,
  isIPhoneX
} = useSystemInfo()
</script>

<template>
  <view :style="{ paddingTop: statusBarHeight + 'px' }">
    <!-- 内容 -->
  </view>
</template>
```

## 📝 代码规范

### 1. ESLint

代码风格检查，确保代码质量。

```bash
# 检查代码
npm run lint

# 自动修复
npm run lint:fix
```

### 2. Prettier

代码格式化工具。

```bash
# 格式化代码
npm run format
```

### 3. Stylelint

样式代码检查。

```bash
# 检查样式
npm run lint:style

# 自动修复
npm run lint:style:fix
```

### 4. 一键检查和修复

```bash
# 检查所有代码
npm run check

# 修复所有问题
npm run fix
```

## 🎨 编码规范

### JavaScript

- 使用 2 空格缩进
- 使用单引号
- 不使用分号
- 使用 ES6+ 语法
- 使用 `const` 和 `let`，不使用 `var`

### Vue

- 组件名使用 PascalCase
- Props 使用 camelCase
- 事件名使用 kebab-case
- 使用 Composition API (script setup)

### CSS/SCSS

- 使用 2 空格缩进
- 类名使用 kebab-case
- 按照属性类型排序（定位 → 盒模型 → 排版 → 视觉 → 动画）

## 🚀 开发建议

1. **环境变量**：根据实际情况修改 `.env.*` 文件中的配置
2. **API 接口**：在 `src/api/` 下添加新的接口文件
3. **工具函数**：在 `src/utils/` 下添加通用工具函数
4. **组件开发**：优先使用 Composition API
5. **代码提交前**：运行 `npm run fix` 检查和修复代码问题

## 📚 参考资料

- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://cn.vitejs.dev/)
- [ESLint 文档](https://eslint.org/)
- [Prettier 文档](https://prettier.io/)
- [Stylelint 文档](https://stylelint.io/)

