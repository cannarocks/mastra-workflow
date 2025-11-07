import { createStep } from "@mastra/core";
import z from "zod";
import { ClassifyMessage } from "../agents/classificator";

const inputSchema = z.object({
  message: z.string().describe("The incoming message to be processed."),
});

export const readMessage = createStep({
  id: `ReadAndClassifyMessage`,
  description: "Read the incoming message and extract relevant information.",
  stateSchema: z.object({
    workspaceId: z.string().describe("The ID of the workspace."),
  }),
  inputSchema,
  outputSchema: z.object({
    response: z.string(),
  }),
  execute: async ({ inputData, state }) => {
    console.log("Executing readMessage step...", inputData, state);
    const { message } = inputData;
    console.log("Reading message:", message);
    const response = await ClassifyMessage.generateLegacy(message);

    return {
      response: response.text,
    };
  },
});
