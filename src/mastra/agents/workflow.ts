import { Agent } from "@mastra/core/agent";
import { mainWorkflow } from "../workflows/e2e-workflow";
import { openai } from "@ai-sdk/openai";

export const WorkflowAgent = new Agent({
  id: "WorkflowAgent",
  name: "Workflow Agent",
  instructions: "You are a helpful assistant that runs the specific workflow.",
  tools: {},
  model: openai("gpt-4o"),
  workflows: { mainWorkflow },
});
