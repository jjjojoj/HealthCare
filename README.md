# 远程医疗/病历管理演示项目

基于 uni-app (Vue3 + Composition API) 的远程医疗演示系统,所有数据均为 mock 数据。

## 项目说明

这是一个纯前端演示项目，包含以下功能模块：

- 登录系统
- 病历列表与详情
- 文件上传
- 智能咨询聊天机器人
- 健康趋势图表（基于 ECharts）
- 用药助手
- 紧急联系人管理
- 电子处方查看
- 视频会诊预约

## 技术栈

- uni-app 3.x
- Vue 3 (Composition API)
- Vite 5.x
- ECharts 5.x

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
- 密码: `123456`

## 项目结构

```
src/
├── pages/          # 页面
├── static/         # 静态资源
│   └── mock/       # Mock 数据
├── App.vue         # 应用入口
├── main.js         # 主入口文件
├── pages.json      # 页面配置
└── manifest.json   # 应用配置
```

## Mock 数据

所有数据存储在 `/src/static/mock/` 目录：

- `users.json` - 用户数据
- `records.json` - 病历数据
- `meds.json` - 药品数据
- `metrics.json` - 健康指标数据

## 浏览器兼容

建议使用现代浏览器：Chrome、Firefox、Safari、Edge 最新版本。

## 注意事项

- 这是一个演示项目，所有数据均为 mock 数据
- 未连接真实后端服务
- 视频会诊功能为占位页面，未实现真实音视频通话
