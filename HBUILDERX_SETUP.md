# HBuilderX 运行说明

## 问题原因

本项目使用 **Vue 3 + Vite** 构建，与 HBuilderX 内置编译器（基于 Vue 2 CLI）不兼容。

## 解决方案

### 方案 1：使用命令行运行（推荐）✅

直接在终端中运行以下命令：

```bash
# 运行 H5 版本（浏览器）
npm run dev:h5
# 访问 http://localhost:5173/

# 运行微信小程序版本
npm run dev:mp-weixin
# 需要在微信开发者工具中导入 dist/dev/mp-weixin 目录

# 构建生产版本
npm run build:h5
npm run build:mp-weixin
```

### 方案 2：在 HBuilderX 中使用外部终端

1. 打开 HBuilderX 底部的"终端"面板
2. 运行命令：`npm run dev:h5`
3. 浏览器访问显示的 localhost 地址

### 方案 3：配置 HBuilderX 外部命令

1. 工具栏 → 运行 → 运行配置 → 外部命令
2. 添加新配置：
   - 名称：运行 H5
   - 命令：`npm run dev:h5`
   - 工作目录：`${workspace_loc}`

## 环境要求

✅ **当前环境：**
- Node.js: v22.18.0
- npm: 10.9.3
- Java: 17.0.9

以上版本均符合要求。

## 已配置的运行脚本

在 `package.json` 中已配置：

```json
{
  "scripts": {
    "dev:h5": "uni",
    "build:h5": "uni build",
    "dev:mp-weixin": "uni -p mp-weixin",
    "build:mp-weixin": "uni build -p mp-weixin"
  }
}
```

## 小程序开发流程

### 微信小程序

1. 运行编译命令：
   ```bash
   npm run dev:mp-weixin
   ```

2. 打开微信开发者工具

3. 导入项目：
   - 项目目录：`/Users/wuyongyl/Desktop/HealthCare/dist/dev/mp-weixin`
   - AppID：使用测试号

4. 开始调试

## 注意事项

- **不要使用** HBuilderX 的"运行到内置浏览器"功能（会报错）
- **推荐使用** 命令行 + Chrome DevTools 进行开发
- 修改代码后会自动热重载
- HBuilderX 仅用于代码编辑和语法提示
