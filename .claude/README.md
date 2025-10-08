# Claude Code 配置说明

本目录包含 Claude Code 的自定义配置和 Hooks。

## 📂 目录结构

```
.claude/
├── hooks/
│   └── post-tool-call.sh   # 工具调用后自动记录修改
└── README.md               # 本文件
```

## 🎣 Hooks 说明

### `post-tool-call.sh`

**功能**：自动记录 Claude Code 对项目文件的重大修改

**触发时机**：每次 Claude Code 调用以下工具时
- `Write` - 创建新文件
- `Edit` - 编辑现有文件
- `NotebookEdit` - 编辑 Jupyter Notebook

**记录位置**：项目根目录 `CHANGELOG.md`

**记录格式**：
```markdown
## 🔄 修改记录
- **时间**：YYYY-MM-DD HH:MM:SS
- **工具**：工具名称
- **说明**：修改说明
```

## 🔧 自定义配置

如需修改记录行为，编辑 `hooks/post-tool-call.sh`：

1. **修改跟踪的工具**：
   ```bash
   TRACKED_TOOLS=("Write" "Edit" "NotebookEdit" "Bash")
   ```

2. **修改记录文件位置**：
   ```bash
   CHANGELOG_FILE="docs/CHANGES.md"
   ```

3. **自定义记录格式**：
   编辑脚本中的 `echo` 语句

## 📖 使用指南

Hook 已自动启用，无需手动操作。每次 Claude Code 修改文件时，会自动在 `CHANGELOG.md` 中追加记录。

查看完整变更历史：
```bash
cat CHANGELOG.md
```

## 🔍 调试

如果 Hook 未生效：

1. 检查脚本权限：
   ```bash
   ls -la .claude/hooks/post-tool-call.sh
   ```
   应显示 `-rwxr-xr-x`（可执行）

2. 手动赋予执行权限：
   ```bash
   chmod +x .claude/hooks/post-tool-call.sh
   ```

3. 查看 Claude Code 配置：
   检查 Claude Code 设置中是否启用了 Hooks

## 📝 注意事项

- Hook 脚本使用 Bash 编写，需要 Unix-like 环境（macOS、Linux）
- Windows 用户可能需要使用 Git Bash 或 WSL
- 不要删除 `CHANGELOG.md`，否则会自动重新创建初始版本
