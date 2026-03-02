[English](./README.md) | 简体中文

# Agent-Skills-Manager-MCP (MCP Server)

一个基于模型上下文协议（MCP，Model Context Protocol）的服务器，充当 AI Agent “技能库管理器”。
它提供了跨越多个项目以及不同主流 AI 编程工具（如各类 AI 编辑器、Agent 框架等）的 AI 规则和技能共享管理工具。

## 特性

- **查询 (Query)**: 从一个核心的 AI 技能库中读取目录。支持 **标准 Agent 技能格式 (Standard Agent Skills Format)**（即包含具有标准 YAML 元数据的 `SKILL.md` 文件的目录）。
- **推送至核心库 (Push Project)**: 提取特定项目生成的规则文件（例如带有 Frontmatter 的 `.cursor/rules/something.mdc`），并严格按照标准的 `<skill_name>/SKILL.md` 格式保存至中央技能库中。
- **全局反向推送 (Push Global)**: 从你的全局工具配置目录（例如 `~/.trae/skills/xyz`）中提取一个完整的技能，直接推送到中央核心库收录。
- **拉取至项目 (Pull Project)**: 从中央技能库拉取指定的技能，并根据当前项目的特定工具环境进行原生格式化。
- **拉取至全局 (Pull Global)**: 拉取指定的技能，并将其原生格式化至用户系统中全局的工具规则目录下。
- **删除 (Delete) [可选开启]**: 将指定的技能从中央核心库中永久剔除。为了防止意外的代码丢失，这项具有破坏性的指令**默认处于完全屏蔽状态**。只有当你在 MCP 服务端环境变量中显式配置了 `AGENT_SKILLS_ENABLE_DELETE=true` 之后，大模型才能识别和使用此特权。

> [!WARNING]
> **关于 AI 的环境感知**：很多时候，AI 助手并不知道它当前运行在哪个编辑器/ CLI 工具中。当你要求 AI 拉取或推送技能时，如果它遇到了环境识别困难，强烈建议你在提示词中明确说明：*“我当前使用的是 Cursor/Trae/Windsurf 等，请把这个技能拉取到我的全局/项目目录中”*，以确保它能选择正确的路径配置。

### 动态可配置路径 (`ide-config.json`)

**是的，这里的路径配置文件起着完全的决定性作用，它主动控制着技能将要被保存的位置！**

服务器通过它来动态管理每一种 AI 工具的目标路径。在第一次运行时，它会在你的技能库旁边自动生成一个 `data/ide-config.json`。

> [!TIP]
> **关于路径准确性**：由于不同工具的版本更新和环境差异，默认生成的路径可能并不完全准确。你可以根据自己实际的工具链目录结构，随时在 `ide-config.json` 中进行手动修正。


结构示例：
```json
{
  "cursor": {
    "project": ".cursor/skills",
    "global": "~/.cursor/skills"
  },
  "my-custom-cli": {
    "project": ".mycli/agents",
    "global": "~/.config/mycli/agents"
  },
...
}
```

#### 它是如何工作的：
1. **动态解析**: 无论何时某个 AI 工具请求拉取一个技能（使用 `pull_skill_to_project` 或是 `pull_skill_to_global` 工具），它都会传递自身的 `ide_name`。MCP 服务器便会在 `ide-config.json` 里面查找该名称。
2. **项目路径 (Project Locations)**: 在 `project` 键下的路径将总是相对于你当前激活的「工作区根目录」进行解析（例如配置的 `.cursor/skills` 就会变成实际路径的 `/path/to/your/project/.cursor/skills` ）。
3. **全局路径 (Global Locations)**: 在 `global` 键下，以 `~/` 开头的路径会被自动转译成你的操作系统的「绝对用户主目录」（例如配置的 `~/.aider/skills` 在 Windows 上会无缝变成 `C:\Users\Username\.aider\skills`，而在 Mac 上则是 `/Users/User/.aider/skills`）。
4. **自定义工具 (Custom Tools)**: 要扩展任何全新的 CLI 工具或 AI 编辑器，你可以简单地自己在该 JSON 里加入一个新名字作为键。MCP Server 将立刻支持把技能文件拉取给它使用，零代码扩展。
5. **工具变体**: 当 AI 助手运行在特定版本的编辑器中时，它会根据 `ide-config.json` 中的配置自动匹配路径。你可以根据实际使用的工具链，在 `ide-config.json` 里面调整本地实际目录。即便 AI 继续请求通用名称，文件也会被完美地写入你的实际文件夹中！
## 编译及运行

### 前置条件

- Node.js >= 20
- npm

### 安装包依赖

```bash
git clone https://github.com/MTQwQ/Agent-Skills-Manager-MCP.git
cd Agent-Skills-Manager-MCP
npm install
```

### 调试阶段

```bash
npm run dev
```

### 生产编译

```bash
npm run build
```

然后你便可以使用下述命令运行构建好的服务：

```bash
npm start
```

注意: 鉴于不同宿主调用的环境差异，你通常需要在 MCP 客户端内填入脚本当下的完整绝对路径以触发运行，例如： `node /absolute/path/to/agent-skills-manager-mcp/build/index.js`。

## 环境配置接入示例

在您本地编辑器的 MCP Settings 面板里，新增一个基于 stdio 的连接：

```json
{
  "mcpServers": {
    "agent-skills-manager-mcp": {
      "command": "node",
      "args": [
        "/absolute/path/to/agent-skills-manager-mcp/build/index.js"
      ]
    }
  }
}
```

### 开启隐藏的删除工具 (Optional)

若你明确需要开启且清楚风险，可通过附加环境变量 `AGENT_SKILLS_ENABLE_DELETE` 的方式激活：

```json
{
  "mcpServers": {
    "agent-skills-manager-mcp": {
      "command": "node",
      "args": [
        "/absolute/path/to/agent-skills-manager-mcp/build/index.js"
      ],
      "env": {
        "AGENT_SKILLS_ENABLE_DELETE": "true"
      }
    }
  }
}
```

### 其他工具 (以通用配置为例)

对于 Windsurf 来说，你可以在它的 `mcp.json` 或是你对应的配置中心定义服务器：

```json
{
  "mcpServers": {
    "agent-skills-manager-mcp": {
      "command": "node",
      "args": [
        "/absolute/path/to/agent-skills-manager-mcp/build/index.js"
      ]
    }
  }
}
```

*(温馨提示：务必要把范例中的 `/absolute/path/to/agent-skills-manager-mcp` 替换为你磁盘系统上的真实绝对位置哦！)*

## 数据源存储目录 (Data Directory)

一旦运行，此服务默认会在本工程所在的同一级根目录下维护一个 `data/skills/` 的数据主仓管目录。所有的技能将均以 **标准 Agent 技能格式 (Standard Agent Skills Format)**（即每一个独立的技能分别成为内含有一个 `SKILL.md` 及其它各类相关技术材料的小目录包）储存着。
