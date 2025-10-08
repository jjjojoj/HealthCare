# HealthCare

uni-app 项目，支持编译到微信小程序和 H5。

## 项目结构

- 首页 (`pages/index/index.vue`)
- 我的 (`pages/my/my.vue`)

## 使用说明

1. 安装依赖（如果使用 HBuilderX，可跳过此步）
```bash
npm install
```

2. 在 HBuilderX 中打开项目

3. 运行到微信小程序
   - 点击菜单：运行 -> 运行到小程序模拟器 -> 微信开发者工具

4. 运行到 H5
   - 点击菜单：运行 -> 运行到浏览器 -> Chrome

## 注意事项

- 需要在 `static/tabbar/` 目录下添加 tabbar 图标文件
- 微信小程序需在 `manifest.json` 中配置 `mp-weixin.appid`
