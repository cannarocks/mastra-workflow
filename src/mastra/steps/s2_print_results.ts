import { createStep } from "@mastra/core";
import z from "zod";

export const printResults = createStep({
  id: `printResults`,
  description: "return the results of message classificator.",
  stateSchema: z.object({
    workspaceId: z.string().describe("The ID of the workspace."),
  }),
  inputSchema: z.object({
    response: z.string(),
  }),
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ inputData, state }) => {
    console.log("Executing printResults step...", inputData, state);
    const { response } = inputData;
    console.log("Reading response:", response);

    return {
      message: response,
    };
  },
});
