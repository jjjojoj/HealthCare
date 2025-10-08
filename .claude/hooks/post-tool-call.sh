#!/bin/bash

# Claude Code Post-Tool-Call Hook
# 自动记录重大修改到 CHANGELOG.md

TOOL_NAME="$1"
CHANGELOG_FILE="CHANGELOG.md"

# 定义需要记录的工具（涉及文件修改的工具）
TRACKED_TOOLS=("Write" "Edit" "NotebookEdit")

# 检查是否是需要跟踪的工具
if [[ " ${TRACKED_TOOLS[@]} " =~ " ${TOOL_NAME} " ]]; then
    # 获取当前时间
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

    # 如果 CHANGELOG.md 不存在，创建初始内容
    if [ ! -f "$CHANGELOG_FILE" ]; then
        cat > "$CHANGELOG_FILE" << 'EOF'
# 📝 项目变更日志

本文件自动记录 Claude Code 对项目的重大修改。

---

EOF
    fi

    # 记录到 CHANGELOG.md（在文件末尾追加）
    echo "" >> "$CHANGELOG_FILE"
    echo "## 🔄 修改记录" >> "$CHANGELOG_FILE"
    echo "- **时间**：$TIMESTAMP" >> "$CHANGELOG_FILE"
    echo "- **工具**：$TOOL_NAME" >> "$CHANGELOG_FILE"
    echo "- **说明**：Claude Code 执行了文件操作" >> "$CHANGELOG_FILE"
    echo "" >> "$CHANGELOG_FILE"
fi

exit 0
