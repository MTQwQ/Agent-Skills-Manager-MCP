import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ErrorCode,
    McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { queryLibrarySkills } from "./tools/query";
import { pushSkillToLibrary } from "./tools/push";
import { pullSkillToProject } from "./tools/pull-project";
import { pullSkillToGlobal } from "./tools/pull-global";
import { pushSkillFromGlobal } from "./tools/push-global";
import { deleteSkillFromLibrary } from "./tools/delete";
import { isDeletionEnabled } from "./utils/env";
import {
    QueryLibrarySkillsArgs,
    PushSkillToLibraryArgs,
    PullSkillToProjectArgs,
    PullSkillToGlobalArgs,
    PushSkillFromGlobalArgs,
    DeleteSkillFromLibraryArgs,
} from "./types";

const IDE_NAME_DESCRIPTION = "The name of the target IDE or CLI tool (e.g., cursor, trae, windsurf, cline, aider, qoder). Infer this from your environment. If unknown, use the tool's core command name, or fallback to 'custom'.";

export const server = new Server(
    {
        name: "agent-skills-manager-mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools: Array<{
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: Record<string, { type: string; description?: string }>;
            required?: string[];
        };
    }> = [
            {
                name: "query_library_skills",
                description: "Get available skills list or read a specific skill markdown.",
                inputSchema: {
                    type: "object" as const,
                    properties: {
                        skill_name: {
                            type: "string",
                            description: "Optional. If empty, returns list. If provided, returns the standard SKILL.md content."
                        }
                    }
                }
            },
            {
                name: "push_skill_to_library",
                description: "Push local project rule file to central skill library.",
                inputSchema: {
                    type: "object" as const,
                    properties: {
                        project_file_path: {
                            type: "string",
                            description: "Absolute or relative path to local rule file."
                        },
                        target_skill_name: {
                            type: "string",
                            description: "Target skill name in the central library."
                        }
                    },
                    required: ["project_file_path", "target_skill_name"]
                }
            },
            {
                name: "push_skill_from_global",
                description: "Push skill from your global tool/IDE dictionary (e.g. ~/.trae/skills) into the central library. If the AI doesn't know its environment, you should manually specify ide_name.",
                inputSchema: {
                    type: "object" as const,
                    properties: {
                        skill_name: {
                            type: "string",
                            description: "Skill name to fetch from the global tool dictionary."
                        },
                        ide_name: {
                            type: "string",
                            description: IDE_NAME_DESCRIPTION
                        }
                    },
                    required: ["skill_name", "ide_name"]
                }
            },
            {
                name: "pull_skill_to_project",
                description: "Pull skill from central library and write to local project's tool dictionary. If the AI doesn't know its environment, you should manually specify ide_name.",
                inputSchema: {
                    type: "object" as const,
                    properties: {
                        skill_name: {
                            type: "string"
                        },
                        ide_name: {
                            type: "string",
                            description: IDE_NAME_DESCRIPTION
                        },
                        project_path: {
                            type: "string",
                            description: "Absolute path to project root"
                        }
                    },
                    required: ["skill_name", "ide_name", "project_path"]
                }
            },
            {
                name: "pull_skill_to_global",
                description: "Pull skill from central library and write to user's global tool dictionary. If the AI doesn't know its environment, you should manually specify ide_name.",
                inputSchema: {
                    type: "object" as const,
                    properties: {
                        skill_name: {
                            type: "string"
                        },
                        ide_name: {
                            type: "string",
                            description: IDE_NAME_DESCRIPTION
                        }
                    },
                    required: ["skill_name", "ide_name"]
                }
            }
        ];

    if (isDeletionEnabled()) {
        tools.push({
            name: "delete_skill_from_library",
            description: "Delete a skill permanently from the central skill library.",
            inputSchema: {
                type: "object" as const,
                properties: {
                    skill_name: {
                        type: "string",
                        description: "The name of the skill to delete."
                    }
                },
                required: ["skill_name"]
            }
        });
    }

    return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const args = request.params.arguments ?? {};
        switch (request.params.name) {
            case "query_library_skills":
                return queryLibrarySkills(args as unknown as QueryLibrarySkillsArgs);
            case "push_skill_to_library":
                return pushSkillToLibrary(args as unknown as PushSkillToLibraryArgs);
            case "pull_skill_to_project":
                return pullSkillToProject(args as unknown as PullSkillToProjectArgs);
            case "pull_skill_to_global":
                return pullSkillToGlobal(args as unknown as PullSkillToGlobalArgs);
            case "push_skill_from_global":
                return pushSkillFromGlobal(args as unknown as PushSkillFromGlobalArgs);
            case "delete_skill_from_library":
                if (!isDeletionEnabled()) {
                    throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${request.params.name}`);
                }
                return deleteSkillFromLibrary(args as unknown as DeleteSkillFromLibraryArgs);
            default:
                throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${request.params.name}`);
        }
    } catch (error: unknown) {
        if (error instanceof McpError) throw error;
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error executing tool: ${message}`
                }
            ],
            isError: true,
        };
    }
});
