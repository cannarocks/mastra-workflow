import { Agent } from "@mastra/core/agent";
import { mainWorkflow } from "../workflows/e2e-workflow";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";

const memory = new Memory();

export const WorkflowAgent = new Agent({
  id: "WorkflowAgent",
  name: "Workflow Agent",
  instructions: "You are a helpful assistant that streams the specific workflow.",
  tools: {},
  model: openai("gpt-4o"),
  workflows: { mainWorkflow },
  memory: memory,
});
