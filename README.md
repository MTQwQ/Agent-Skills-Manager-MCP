English | [简体中文](./README-zh-CN.md)

# Agent-Skills-Manager-MCP (MCP Server)

A Model Context Protocol (MCP) server that acts as an AI agent "skills library manager".
It provides tools to manage and share AI rules/skills across various AI-enhanced IDEs and agent frameworks.

## Features

- **Query**: Read from a central library of AI skills. Supports **Standard Agent Skills Format** (directories containing `SKILL.md` with standard YAML metadata).
- **Push (Project)**: Extract IDE-specific rule files (like `.cursor/rules/something.mdc` with frontmatter) and save them to the central skill library precisely adopting the standard `<skill_name>/SKILL.md` format.
- **Push (Global)**: Push a skill backwards from your global tool dictionary (e.g. `~/.trae/skills/xyz`) into the central library.
- **Pull (Project)**: Pull a designated skill from the central library and format it for the specific environment in the current project (e.g., injecting YAML frontmatter natively).
- **Pull (Global)**: Pull a designated skill and format it natively into the user's global tool rules directory.
- **Delete (Opt-In)**: Delete a skill permanently from the central library. By default, this destructive tool is **disabled** to prevent accidental data loss. It must be explicitly enabled by passing the `AGENT_SKILLS_ENABLE_DELETE=true` environment variable to the MCP server.

> [!WARNING]
> **Environment Awareness**: Often, AI assistants do not know the exact editor/CLI they are running within. When asking the AI to pull or push a skill, if it encounters difficulties, it is highly recommended to state explicitly in your prompt: *"I am currently using Cursor/Trae/Windsurf/etc., please pull this skill to my global/project dictionary"* to ensure the correct path is chosen.

### Configurable Paths (`ide-config.json`)

**Yes, this configuration file is fully functional and actively controls where skills are saved!** 

The server dynamically manages destination paths per AI tool. Upon first run, it generates a `data/ide-config.json` next to your skills library.

> [!TIP]
> **On Path Accuracy**: Due to version updates and environmental differences among various tools, the default generated paths may not be 100% accurate. You are encouraged to manually adjust the paths in `ide-config.json` to match your actual toolchain layout.


Example structure:
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

#### How it works:
1. **Dynamic Resolution**: Whenever an AI tool requests to pull a skill (using the `pull_skill_to_project` or `pull_skill_to_global` tool), it passes its `ide_name`. The MCP server looks up that name in `ide-config.json`.
2. **Project Locations**: Paths under `project` are resolved relative to your current workspace root (e.g., `.cursor/skills` becomes `/path/to/your/project/.cursor/skills`).
3. **Global Locations**: Paths under `global` that start with `~/` are automatically resolved to your operating system's absolute user home directory (e.g., `~/.aider/skills` seamlessly becomes `C:\Users\Username\.aider\skills` on Windows or `/Users/User/.aider/skills` on Mac).
4. **Custom Tools**: You can add any brand new CLI tool or AI editor simply by creating a new key in the JSON file. The MCP server will instantly support pulling skills into it.
5. **Tool Variants**: Different AI assistants or editors may have different path requirements. You can easily adapt the target locations by editing `ide-config.json` to match your local setup. The server will seamlessly route files to the correct folders even if the assistant uses a generic identifier.
## Build and Run

### Prerequisites

- Node.js >= 20
- npm

### Installation

```bash
git clone https://github.com/MTQwQ/Agent-Skills-Manager-MCP.git
cd Agent-Skills-Manager-MCP
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

Then you can start the built server using:

```bash
npm start
```

Note: Depending on your environment, you might need to point the MCP client to the exact path of the script using `node /absolute/path/to/agent-skills-manager-mcp/build/index.js`.

## Configuration Example

In your editor's MCP settings, add a new stdio connection:

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

### Enabling the Delete Tool (Optional)

If you must use the `delete_skill_from_library` tool, you must inject the opt-in environment flag into your IDE connection settings like this:

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

### Other Tools (Example)

For Windsurf, you might define it in your `mcp.json` or equivalent configuration:

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

*(Remember to replace `/absolute/path/to/agent-skills-manager-mcp` with the actual location on your file system.)*

## Data Directory

By default, the server manages a `data/skills/` directory alongside the project's root. Skills are stored there in the **Standard Agent Skills Format** (each skill is a directory containing a `SKILL.md` file and other related technical assets).
