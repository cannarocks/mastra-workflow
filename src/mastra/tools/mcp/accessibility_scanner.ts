import { MCPClient } from "@mastra/mcp";

export const accessibilityScannerMcpClient = new MCPClient({
  id: "accessibility_scanner",
  servers: {
    "accessibility-scanner": {
      url: new URL(
        `http://localhost:3000/sse`
      ),
    },
  },
});
