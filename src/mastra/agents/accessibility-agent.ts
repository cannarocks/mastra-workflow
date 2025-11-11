import { Agent } from "@mastra/core/agent";
import { accessibilityScannerMcpClient } from "../tools/mcp/accessibility_scanner";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";


const memory = new Memory();

export const AccessibilityAgent = new Agent({
  id: "AccessibilityAgent",
  name: "Accessibility Agent",
  description: "Checks web accessibility using an MCP service.",
  instructions:
    "You are an agent that checks web accessibility using an external MCP service.",
  tools: await accessibilityScannerMcpClient.getTools(),
  model: openai("gpt-5-mini"),
  memory: memory,
  
});
