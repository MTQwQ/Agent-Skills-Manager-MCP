import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./server";

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("agent-skills-manager-mcp running on stdio");
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
