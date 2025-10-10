# 🏥 远程医疗/病历管理演示项目

> 基于 uni-app (Vue3 + Composition API) 的远程医疗演示系统  
> **健康绿主题 | 数据可视化 | 专业高级感 | 简洁易用**

[![UniApp](https://img.shields.io/badge/UniApp-3.x-brightgreen)](https://uniapp.dcloud.net.cn/)
[![Vue](https://img.shields.io/badge/Vue-3.x-42b883)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## ✨ 项目亮点

### 🎨 全新 UI 设计
- **健康绿主题**：清新的绿色配色方案（`#37CD87`）
- **数据可视化仪表盘**：直观展示健康数据
- **精致的阴影和动画**：提升用户体验
- **统一的设计语言**：组件风格一致
- **渐变色卡片**：营造现代化界面

### 📱 功能模块
- ✅ 登录系统
- ✅ **健康数据仪表盘**（新增）
  - 💓 核心健康指标监测（心率、血压、血糖、BMI）
  - 📈 7天健康趋势图表
  - 📊 健康统计数据（步数、卡路里、睡眠、饮水）
  - 🤖 AI 智能健康建议
- ✅ 病历列表与详情
- ✅ 文件上传（支持图片、PDF）
- ✅ AI 智能咨询聊天机器人
- ✅ 健康趋势图表（基于 ECharts）
- ✅ 用药助手
- ✅ 紧急联系人管理
- ✅ 电子处方查看与导出
- ✅ 视频会诊（权限控制）

### 🛠 技术栈
- **框架**：uni-app 3.x
- **前端**：Vue 3 (Composition API)
- **构建**：Vite 5.x
- **图表**：ECharts 5.x
- **样式**：SCSS + CSS3
- **平台**：H5 + 微信小程序

## 如何运行

### 方式一：使用 HBuilderX

1. 下载并安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 导入本项目到 HBuilderX
3. 运行 -> 运行到浏览器 -> 选择浏览器

### 方式二：使用命令行

1. 安装依赖：
```bash
npm install
```

2. 运行开发服务器：
```bash
npm run dev
```

3. 浏览器访问 http://localhost:5173

### 方式三：运行到微信小程序

```bash
npm run dev:mp-weixin
```

然后使用微信开发者工具导入 `dist/dev/mp-weixin` 目录。

## 登录信息

- 用户名: `demo`
- 密码: `demo`

## 📁 项目结构

```
HealthCare/
├── src/
│   ├── components/          # 公共组件
│   │   ├── AppHeader.vue    # 应用头部（深蓝渐变）
│   │   ├── BottomNav.vue    # 底部导航（线性图标风格）
│   │   └── MediaUploader.vue
│   ├── pages/               # 页面
│   │   ├── home/            # 首页（深蓝用户卡片）
│   │   ├── login/           # 登录
│   │   ├── records/         # 病历管理
│   │   ├── chatbot/         # AI 咨询
│   │   ├── trends/          # 健康趋势
│   │   ├── prescription/    # 电子处方
│   │   ├── video/           # 视频会诊
│   │   ├── my/              # 我的
│   │   └── ...
│   ├── static/              # 静态资源
│   │   ├── index.css        # 全局样式（主题色）
│   │   └── mock/            # Mock 数据
│   ├── styles/              # 样式文件
│   │   └── theme.scss       # 主题变量和 Mixin
│   ├── App.vue              # 应用入口
│   ├── main.js              # 主入口文件
│   ├── pages.json           # 页面配置
│   └── manifest.json        # 应用配置
├── docs/                    # 文档
│   ├── UI_DESIGN_GUIDE.md   # UI 设计指南
│   ├── COLOR_PALETTE.md     # 颜色色板参考
│   ├── COMPONENT_SHOWCASE.md # 组件展示
│   └── README.md            # 文档索引
├── CHANGELOG.md             # 更新日志
└── README.md                # 项目说明
```

## 📊 Mock 数据

所有数据存储在 `/src/static/mock/` 目录：

- `users.json` - 用户数据（包含角色：patient/clinician）
- `records.json` - 病历数据
- `meds.json` - 药品数据
- `metrics.json` - 健康指标数据
- `prescriptions.json` - 处方数据

## 🎨 UI 设计系统

### 主题色彩

| 颜色 | HEX | 用途 |
|------|-----|------|
| 🔵 医疗蓝 | `#3A8BD4` | 主色 - 按钮、链接 |
| 🔷 深蓝 | `#2870B5` | Header、渐变 |
| 💠 浅蓝 | `#5BA4E0` | 高亮、渐变 |
| ⚪ 页面背景 | `#F8F9FA` | 整体背景 |
| ⬜ 卡片背景 | `#FFFFFF` | 卡片容器 |

### 设计规范

- **圆角**：按钮 8rpx，卡片 12rpx，主卡片 20rpx
- **阴影**：柔和阴影 `0 6rpx 18rpx rgba(0, 0, 0, 0.05)`
- **字体**：主文字 `#333333`，次要 `#666666`，辅助 `#999999`
- **单位**：所有尺寸使用 **rpx**

📖 **详细文档**：查看 [docs/UI_DESIGN_GUIDE.md](docs/UI_DESIGN_GUIDE.md)

## 🧩 核心组件

### 1. AppHeader - 应用头部
- 深蓝色渐变背景
- 毛玻璃效果
- 自动显示用户名

### 2. BottomNav - 底部导航
- 纯白背景
- 选中状态顶部指示条
- 图标灰度过滤效果

### 3. 用户信息卡片
- 深蓝渐变背景（`#2870B5` → `#1B5A91`）
- 装饰性毛玻璃背景圆点
- 白色粗体显示健康分数

📖 **组件展示**：查看 [docs/COMPONENT_SHOWCASE.md](docs/COMPONENT_SHOWCASE.md)

## 🎯 功能特性

### 视频会诊
- ✅ 基于角色的权限控制（只有医生可发起）
- ✅ 房间 ID 生成和链接复制
- ✅ WebRTC 技术说明（STUN/TURN、SFU 等）
- ⚠️ 注：占位功能，未实现真实音视频

### 电子处方
- ✅ 处方详情展示
- ✅ PDF 导出功能（模拟）
- ✅ 专业格式化布局

### 健康趋势
- ✅ ECharts 可视化图表
- ✅ 多维度数据展示
- ✅ 时间范围筛选

## 🌐 浏览器兼容

建议使用现代浏览器：
- ✅ Chrome（推荐）
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## ⚠️ 注意事项

- 这是一个**演示项目**，所有数据均为 mock 数据
- 未连接真实后端服务
- 视频会诊功能为占位页面，未实现真实音视频通话
- 仅供学习和参考使用

## 📚 文档

- [UI 设计指南](docs/UI_DESIGN_GUIDE.md) - 完整的设计系统文档
- [颜色色板参考](docs/COLOR_PALETTE.md) - 所有颜色的快速参考
- [组件展示](docs/COMPONENT_SHOWCASE.md) - 组件使用示例
- [更新日志](CHANGELOG.md) - 项目更新记录

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**最后更新：** 2025-10-08  
**版本：** v1.0  
**作者：** HealthCare Team
