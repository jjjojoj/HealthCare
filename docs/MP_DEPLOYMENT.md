# 微信小程序部署指南

## 编译说明

项目已完成小程序适配，支持微信小程序平台。

### 编译命令

```bash
# 开发模式
npm run dev:mp-weixin

# 生产模式
npm run build:mp-weixin
```

### 输出目录

编译后的小程序代码位于：
- 开发模式：`dist/dev/mp-weixin/`
- 生产模式：`dist/build/mp-weixin/`

## 微信开发者工具配置

### 1. 导入项目

1. 打开微信开发者工具
2. 选择「导入项目」
3. 项目目录选择：`dist/dev/mp-weixin`
4. AppID：使用测试号或申请的正式 AppID

### 2. 项目配置

项目已自动生成 `project.config.json`，包含以下配置：

- **ES6 转 ES5**：已启用
- **URL 校验**：开发时关闭，上线前需开启
- **代码压缩**：生产模式自动启用
- **增强编译**：已启用

### 3. 调试说明

- **开发模式**：包含 sourcemap，便于调试
- **性能优化**：生产模式会进行代码压缩和优化
- **包体积**：注意主包不超过 2MB，总包不超过 20MB

## 平台差异处理

### 条件编译

项目使用条件编译处理平台差异：

```vue
<!-- H5 平台 -->
<!-- #ifdef H5 -->
<view>H5 特有内容</view>
<!-- #endif -->

<!-- 微信小程序平台 -->
<!-- #ifdef MP-WEIXIN -->
<view>小程序特有内容</view>
<!-- #endif -->

<!-- 非 H5 平台 -->
<!-- #ifndef H5 -->
<view>小程序等其他平台</view>
<!-- #endif -->
```

### CSS 差异

以下 CSS 特性在小程序中已用条件编译保护：

- `backdrop-filter`: 毛玻璃效果（H5 独有）
- `filter: drop-shadow()`: 投影滤镜（H5 独有）
- `filter: blur()`: 模糊效果（H5 独有）
- `position: sticky`: 粘性定位（小程序使用 fixed 替代）

### JavaScript 差异

#### Web API 保护

```javascript
// window 对象
// #ifdef H5
window.addEventListener('resize', handleResize)
// #endif

// localStorage
// #ifdef H5
localStorage.setItem('key', 'value')
// #endif
// #ifdef MP-WEIXIN
uni.setStorageSync('key', 'value')
// #endif
```

#### 第三方库

- **ECharts**：仅在 H5 平台使用，小程序端使用 `uCharts` 或 `echarts-for-weixin`
- **axios**：使用 `uni.request` 替代

## 功能适配状态

### ✅ 已适配功能

- 首页展示
- 健康档案列表
- 用药提醒
- 个人中心
- 登录注册
- 底部导航

### ⚠️ 部分适配

- **健康趋势图表**：H5 使用 ECharts，小程序待集成图表库
- **视频咨询**：需使用小程序 `live-pusher` 组件
- **AI 聊天**：需配置服务器域名

### 🔄 待适配

- 文件上传（需使用 `uni.uploadFile`）
- 地图服务（需使用微信地图 API）
- 分享功能（需使用小程序分享 API）

## 上线检查清单

### 1. 配置检查

- [ ] 替换 AppID 为正式 AppID
- [ ] 配置服务器域名（request/upload/download）
- [ ] 启用 URL 校验
- [ ] 配置业务域名（web-view）

### 2. 代码优化

- [ ] 移除 console.log
- [ ] 压缩图片资源
- [ ] 分包加载（如需要）
- [ ] 清理无用代码

### 3. 功能测试

- [ ] 真机测试各功能
- [ ] 测试弱网环境
- [ ] 测试不同机型兼容性
- [ ] 测试支付功能（如有）

### 4. 合规要求

- [ ] 隐私政策
- [ ] 用户协议
- [ ] 数据安全
- [ ] 内容审核

## 常见问题

### Q1: 样式在小程序中显示异常？

A: 检查是否使用了小程序不支持的 CSS 特性，使用条件编译或替代方案。

### Q2: 接口请求失败？

A: 确保在小程序后台配置了服务器域名，且必须是 HTTPS。

### Q3: 图表不显示？

A: 趋势页面的 ECharts 仅在 H5 平台显示，小程序需集成专用图表库。

### Q4: 包体积过大？

A: 考虑：
- 压缩图片
- 使用分包加载
- 按需引入组件
- 移除未使用的资源

## 性能优化建议

1. **图片优化**
   - 使用 WebP 格式
   - CDN 加速
   - 懒加载

2. **代码优化**
   - 按需加载
   - 减少 setData 频率
   - 避免频繁的页面切换

3. **体验优化**
   - 骨架屏
   - 加载提示
   - 错误处理

## 技术支持

如遇问题，请查看：
- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- 项目 Issue 追踪



