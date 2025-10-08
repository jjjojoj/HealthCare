# 📝 项目变更日志

本文件记录 Claude Code 对项目的重大修改历史。

---

## 📋 任务执行记录

### 2025-10-08 - 项目初始化
- **任务**：创建完整的远程医疗/病历管理演示系统
- **重大修改**：
  - 基于 uni-app + Vue3 + Composition API 搭建项目框架
  - 创建 11 个功能页面（登录、病历、智能咨询、健康趋势等）
  - 集成 ECharts 5.x 用于数据可视化
  - 配置多端支持（H5、微信小程序、APP）
- **涉及文件**：
  - `package.json` - 依赖配置
  - `src/pages.json` - 页面路由配置
  - `src/manifest.json` - 应用配置
  - `src/pages/**/*.vue` - 11 个页面组件
  - `src/static/index.css` - 全局样式
- **时间**：2025-10-08

### 2025-10-08 - Mock 数据更新
- **任务**：生成符合需求的静态 mock 数据
- **重大修改**：
  - 更新用户数据结构（添加 dob, gender, emergency_contact）
  - 重构病历数据（添加 image_analysis 字段和图片路径）
  - 扩展药物数据（8种药物，含 ATC 编码和相互作用）
  - 生成 30 天健康指标时序数据（血压、心率、血糖）
- **涉及文件**：
  - `src/static/mock/users.json`
  - `src/static/mock/records.json`
  - `src/static/mock/meds.json`
  - `src/static/mock/metrics.json`
  - `src/static/mock/images/.gitkeep`
- **时间**：2025-10-08

---

## 🔧 配置说明

项目已配置 Claude Code Hook，后续重大修改将自动记录到此文件。

配置位置：`.claude/hooks/post-tool-call.sh`
