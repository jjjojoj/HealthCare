# 微信小程序运行指南

## 快速开始

### 1. 编译小程序

```bash
npm run dev:mp-weixin
```

编译完成后会输出：`dist/dev/mp-weixin`

### 2. 打开微信开发者工具

1. 启动微信开发者工具
2. 选择"导入项目"
3. 项目目录选择：`/Users/wuyongyl/Desktop/HealthCare/dist/dev/mp-weixin`
4. AppID：选择"测试号"或输入你的小程序 AppID

### 3. 开始调试

- 编译过程会持续监听文件变化
- 修改源代码后会自动重新编译
- 在微信开发者工具中点击"编译"刷新

## 已解决的问题

### ✅ TabBar 图标问题

**问题：** `app.json: ["tabBar"]["list"][0]["iconPath"]: "static/tabbar/home.png" 未找到`

**解决方案：**
- 已创建 8 个 PNG 格式的 tabBar 图标
- 位置：`static/tabbar/*.png`
- 包括：home, records, chat, my（各有普通和选中状态）

**图标列表：**
- `home.png` / `home-active.png` - 首页
- `records.png` / `records-active.png` - 病历
- `chat.png` / `chat-active.png` - 咨询
- `my.png` / `my-active.png` - 我的

**注意：** 当前图标是最小化占位图标（1x1px 灰色/紫色），建议后续使用设计工具创建 81x81px 的实际图标。

## 推荐的图标设计规范

### 微信小程序 TabBar 图标要求

- **格式：** PNG
- **尺寸：** 81x81px（推荐）
- **大小：** 不超过 40KB
- **颜色：**
  - 未选中：`#999999`（灰色）
  - 选中：`#667eea`（渐变紫）

### 创建更好的图标

你可以使用以下工具创建图标：

1. **Figma / Sketch** - 专业设计工具
2. **iconfont.cn** - 阿里巴巴图标库
3. **IconPark** - 字节跳动图标库
4. **在线工具：**
   - https://www.iconfinder.com/
   - https://www.flaticon.com/

创建后替换 `static/tabbar/*.png` 文件即可。

## 小程序开发注意事项

### 与 H5 的区别

1. **路由方式不同：**
   - H5: `uni.navigateTo()`
   - 小程序：同样使用 `uni.navigateTo()`，但有页面栈限制（10层）

2. **样式差异：**
   - 部分 CSS 属性在小程序中不支持
   - 使用 rpx 替代 px 实现响应式

3. **API 差异：**
   - 小程序需要配置域名白名单
   - 某些 Web API 不可用

### 本地存储

项目使用 `uni.setStorageSync` / `uni.getStorageSync`，已自动适配小程序。

### Mock 数据

所有 Mock 数据已包含在编译输出中：
- `dist/dev/mp-weixin/static/mock/*.json`

## 常用命令

```bash
# 开发模式（监听文件变化）
npm run dev:mp-weixin

# 生产构建
npm run build:mp-weixin

# H5 开发
npm run dev:h5

# H5 构建
npm run build:h5
```

## 发布流程

### 1. 构建生产版本

```bash
npm run build:mp-weixin
```

输出目录：`dist/build/mp-weixin`

### 2. 上传代码

1. 在微信开发者工具中打开 `dist/build/mp-weixin`
2. 点击右上角"上传"
3. 填写版本号和项目备注
4. 上传到微信公众平台

### 3. 提交审核

1. 登录微信公众平台
2. 进入"版本管理"
3. 选择刚上传的版本提交审核

## 故障排查

### 问题：图标不显示

**解决：**
```bash
# 重新复制图标到编译输出
mkdir -p dist/dev/mp-weixin/static/tabbar
cp static/tabbar/*.png dist/dev/mp-weixin/static/tabbar/
```

### 问题：页面空白

**检查：**
1. 微信开发者工具控制台是否有错误
2. `app.json` 中的 `pages` 路径是否正确
3. 首页组件是否正确渲染

### 问题：localStorage 数据丢失

**说明：** 微信开发者工具在重新编译时会清除 Storage，这是正常的。真机上不会出现此问题。

## 测试账号

- **用户名：** `demo`
- **密码：** `demo`

登录后可以体验完整功能。
