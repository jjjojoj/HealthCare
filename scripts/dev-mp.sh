#!/bin/bash
# 微信小程序开发模式快捷脚本

echo "🚀 启动微信小程序开发模式..."
echo "📁 输出目录: dist/dev/mp-weixin"
echo "📖 部署文档: docs/MP_DEPLOYMENT.md"
echo ""
echo "请在微信开发者工具中导入项目："
echo "  项目目录: $(pwd)/dist/dev/mp-weixin"
echo ""

npm run dev:mp-weixin
