import { Agent } from "@mastra/core/agent";
import { mainWorkflow } from "../workflows/e2e-workflow";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";

const memory = new Memory();

export const WorkflowAgent = new Agent({
  id: "WorkflowAgent",
  name: "Workflow Agent",
  instructions:
    "You are a connector agent. Your sole purpose is to pass the user's input to the mainWorkflow without any modification or additional commentary. Just stream the workflow's response.",
  tools: {},
  model: openai("gpt-4o"),
  workflows: { mainWorkflow },
  memory: memory,
});
