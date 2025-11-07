import { createStep } from "@mastra/core";
import z from "zod";
import { ClassifyMessage } from "../agents/classificator";

const inputSchema = z.object({
  message: z.string().describe("The incoming message to be processed."),
});

export const classificationOutput = z.object({
  response: z.string(),
  intent: z.enum(["support_request", "create_test_plan"]),
  topic: z.string(),
  summary: z.string(),
});

export const readMessage = createStep({
  id: `ReadAndClassifyMessage`,
  description: "Read the incoming message and extract relevant information.",
  stateSchema: z.object({
    workspaceId: z.string().describe("The ID of the workspace."),
  }),
  inputSchema,
  outputSchema: classificationOutput,
  execute: async ({ inputData, state }) => {
    console.log("Executing readMessage step...", inputData, state);
    const { message } = inputData;
    console.log("Reading message:", message);
    const data = await ClassifyMessage.generateLegacy(message, {
      output: classificationOutput,
    });

    return {
      response: data.object.response,
      intent: data.object.intent,
      topic: data.object.topic,
      summary: data.object.summary,
    };
  },
});
