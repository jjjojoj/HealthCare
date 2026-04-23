<p align="center">
  <h1 align="center">🏥 远程医疗管理系统</h1>
  <p align="center">HealthCare Management System</p>
</p>

> 基于 uni-app + Vue3 的智能健康管理演示平台，涵盖病历管理、健康数据可视化、AI 智能咨询等功能模块。

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883?logo=vue.js)](https://vuejs.org/)
[![uni-app](https://img.shields.io/badge/uni--app-3.x-brightgreen)](https://uniapp.dcloud.net.cn/)
[![ECharts](https://img.shields.io/badge/ECharts-5.x-e43961?logo=apache-echarts)](https://echarts.apache.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ 功能特性

- 📊 **健康数据仪表盘** — 心率、血压、血糖、BMI 等核心指标监测与 7 天趋势图表
- 📋 **病历管理** — 病历列表浏览与详情查看，支持文件上传（图片、PDF）
- 🤖 **AI 智能咨询** — 模拟智能问答聊天机器人
- 📈 **健康趋势图表** — 基于 ECharts 的多维度数据可视化
- 💊 **用药助手** — 药品信息管理与用药提醒
- 📝 **电子处方** — 处方详情展示与模拟 PDF 导出
- 📹 **视频会诊** — 基于角色的权限控制（占位功能）
- 🆘 **紧急联系人** — 紧急联系人信息管理

## 🛠 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 (Composition API) | 前端框架 |
| uni-app 3.x | 跨平台开发框架 |
| Vite 5.x | 构建工具 |
| ECharts 5.x | 数据可视化 |
| SCSS + CSS3 | 样式方案 |
| Vant Weapp | UI 组件库 |

目标平台：H5 / 微信小程序

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm >= 7

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/jjjojoj/HealthCare.git
cd HealthCare

# 安装依赖
npm install

# 启动 H5 开发服务器
npm run dev:h5
```

浏览器访问 http://localhost:5173

### 微信小程序

```bash
npm run dev:mp-weixin
```

然后使用微信开发者工具导入 `dist/dev/mp-weixin` 目录。

### 使用 HBuilderX

1. 下载安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 导入本项目
3. 运行 → 运行到浏览器

---

## 🔐 演示账号

| 字段 | 值 |
|------|------|
| 用户名 | `demo` |
| 密码 | `demo` |

---

## 📁 项目结构

```
HealthCare/
├── src/
│   ├── components/          # 公共组件
│   │   ├── AppHeader.vue
│   │   └── BottomNav.vue
│   ├── composables/         # 组合式函数
│   ├── config/              # 配置文件
│   ├── pages/               # 页面目录
│   │   ├── login/           # 登录
│   │   ├── home/            # 首页仪表盘
│   │   ├── records/         # 病历管理
│   │   ├── chatbot/         # AI 智能咨询
│   │   ├── trends/          # 健康趋势
│   │   ├── meds/            # 用药助手
│   │   ├── prescription/    # 电子处方
│   │   ├── video/           # 视频会诊
│   │   ├── emergency/       # 紧急联系人
│   │   ├── upload/          # 文件上传
│   │   └── my/              # 个人中心
│   ├── static/              # 静态资源与 Mock 数据
│   ├── styles/              # 全局样式
│   ├── App.vue
│   ├── main.js
│   ├── pages.json           # 页面路由配置
│   └── manifest.json        # 应用配置
├── docs/                    # 项目文档
├── package.json
└── README.md
```

---

## 📄 页面总览

| 页面 | 路径 | 说明 | 状态 |
|------|------|------|------|
| 登录 | pages/login/login | 用户登录认证 | ✅ 可用 |
| 首页 | pages/home/home | 健康数据仪表盘 | ✅ 可用 |
| 病历列表 | pages/records/list | 病历记录浏览 | ✅ 可用 |
| 病历详情 | pages/records/detail | 单条病历详情 | ✅ 可用 |
| 智能咨询 | pages/chatbot/chat | AI 问答机器人 | ✅ 可用 |
| 健康趋势 | pages/trends/trends | ECharts 趋势图表 | ✅ 可用 |
| 用药助手 | pages/meds/meds | 药品信息管理 | ✅ 可用 |
| 电子处方 | pages/prescription/prescription | 处方详情与导出 | ✅ 可用 |
| 视频会诊 | pages/video/video | 远程视频（占位） | ⚠️ 占位 |
| 紧急联系人 | pages/emergency/emergency | 联系人管理 | ✅ 可用 |
| 文件上传 | pages/upload/upload | 图片/PDF 上传 | ✅ 可用 |
| 个人中心 | pages/my/my | 用户信息设置 | ✅ 可用 |

---

## 📸 截图

> 截图待添加

---

## 📚 文档

| 文档 | 说明 |
|------|------|
| [UI 重设计 2025](docs/UI_REDESIGN_2025.md) | 2025 版 UI 设计规范与升级记录 |
| [H5 设计规范](docs/H5_DESIGN_SPEC.md) | H5 端设计规范文档 |

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

> ⚠️ **免责声明**：本项目为演示项目，所有数据均为模拟数据，不构成任何医疗建议。
