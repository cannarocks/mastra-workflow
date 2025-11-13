import { Agent } from "@mastra/core/agent";
import { instructions } from "./prompt";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { createTool, Tool } from "@mastra/core";
import z from "zod";
import { getUserTemplates } from "../../tools/api/getUserTemplates";

const exampleTool = createTool({
  id: "exampleTool",
  description: "An example tool that does nothing.",
  inputSchema: z.object({
    query: z.string(),
  }),
  outputSchema: z.string(),
  execute: async (context) => {
    console.log("Executing example tool with input:", context);
    return `Received query: ${context}`;
  },
});

export const ClassifyMessage = new Agent({
  name: "Message Classificator",
  instructions,
  model: openai("o4-mini"),
  tools: { getUserTemplates },
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
});
