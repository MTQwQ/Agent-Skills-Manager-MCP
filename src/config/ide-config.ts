import * as fs from 'fs';
import * as path from 'path';
import { IDEConfig } from '../types';

const CONFIG_PATH = path.join(__dirname, '..', '..', 'data', 'ide-config.json');

export const DEFAULT_CONFIG: IDEConfig = {
    "amp": {
        "project": ".agents/skills",
        "global": "~/.config/agents/skills"
    },
    "antigravity": {
        "project": ".agent/skills",
        "global": "~/.gemini/antigravity/skills"
    },
    "augment": {
        "project": ".augment/skills",
        "global": "~/.augment/skills"
    },
    "claude-code": {
        "project": ".claude/skills",
        "global": "~/.claude/skills"
    },
    "openclaw": {
        "project": "skills",
        "global": "~/.openclaw/skills"
    },
    "cline": {
        "project": ".agents/skills",
        "global": "~/.agents/skills"
    },
    "codebuddy": {
        "project": ".codebuddy/skills",
        "global": "~/.codebuddy/skills"
    },
    "codex": {
        "project": ".agents/skills",
        "global": "~/.codex/skills"
    },
    "command-code": {
        "project": ".commandcode/skills",
        "global": "~/.commandcode/skills"
    },
    "continue": {
        "project": ".continue/skills",
        "global": "~/.continue/skills"
    },
    "cortex": {
        "project": ".cortex/skills",
        "global": "~/.snowflake/cortex/skills"
    },
    "crush": {
        "project": ".crush/skills",
        "global": "~/.config/crush/skills"
    },
    "cursor": {
        "project": ".agents/skills",
        "global": "~/.cursor/skills"
    },
    "droid": {
        "project": ".factory/skills",
        "global": "~/.factory/skills"
    },
    "gemini-cli": {
        "project": ".agents/skills",
        "global": "~/.gemini/skills"
    },
    "github-copilot": {
        "project": ".agents/skills",
        "global": "~/.copilot/skills"
    },
    "goose": {
        "project": ".goose/skills",
        "global": "~/.config/goose/skills"
    },
    "junie": {
        "project": ".junie/skills",
        "global": "~/.junie/skills"
    },
    "iflow-cli": {
        "project": ".iflow/skills",
        "global": "~/.iflow/skills"
    },
    "kilo": {
        "project": ".kilocode/skills",
        "global": "~/.kilocode/skills"
    },
    "kimi-cli": {
        "project": ".agents/skills",
        "global": "~/.config/agents/skills"
    },
    "kiro-cli": {
        "project": ".kiro/skills",
        "global": "~/.kiro/skills"
    },
    "kode": {
        "project": ".kode/skills",
        "global": "~/.kode/skills"
    },
    "mcpjam": {
        "project": ".mcpjam/skills",
        "global": "~/.mcpjam/skills"
    },
    "mistral-vibe": {
        "project": ".vibe/skills",
        "global": "~/.vibe/skills"
    },
    "mux": {
        "project": ".mux/skills",
        "global": "~/.mux/skills"
    },
    "opencode": {
        "project": ".agents/skills",
        "global": "~/.config/opencode/skills"
    },
    "openhands": {
        "project": ".openhands/skills",
        "global": "~/.openhands/skills"
    },
    "pi": {
        "project": ".pi/skills",
        "global": "~/.pi/agent/skills"
    },
    "qoder": {
        "project": ".qoder/skills",
        "global": "~/.qoder/skills"
    },
    "qwen-code": {
        "project": ".qwen/skills",
        "global": "~/.qwen/skills"
    },
    "replit": {
        "project": ".agents/skills",
        "global": "~/.config/agents/skills"
    },
    "roo": {
        "project": ".roo/skills",
        "global": "~/.roo/skills"
    },
    "trae": {
        "project": ".trae/skills",
        "global": "~/.trae/skills"
    },
    "trae-cn": {
        "project": ".trae/skills",
        "global": "~/.trae-cn/skills"
    },
    "windsurf": {
        "project": ".windsurf/skills",
        "global": "~/.codeium/windsurf/skills"
    },
    "zencoder": {
        "project": ".zencoder/skills",
        "global": "~/.zencoder/skills"
    },
    "neovate": {
        "project": ".neovate/skills",
        "global": "~/.neovate/skills"
    },
    "pochi": {
        "project": ".pochi/skills",
        "global": "~/.pochi/skills"
    },
    "adal": {
        "project": ".adal/skills",
        "global": "~/.adal/skills"
    },
    "universal": {
        "project": ".agents/skills",
        "global": "~/.config/agents/skills"
    },
    "custom": {
        "project": ".custom/skills",
        "global": "~/.custom/skills"
    }
};

export function readOrInitConfig(): IDEConfig {
    if (!fs.existsSync(CONFIG_PATH)) {
        return DEFAULT_CONFIG;
    }
    try {
        const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
        return JSON.parse(data) as IDEConfig;
    } catch (e) {
        console.error("Failed to parse ide-config.json, falling back to defaults", e);
        return DEFAULT_CONFIG;
    }
}
