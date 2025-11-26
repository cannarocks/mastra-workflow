import { createStep } from '@mastra/core/workflows';
import z from "zod";
import { globalStateSchema } from "./types";

export const printResults = createStep({
  id: `printResults`,
  description: "return the results of message classificator.",
  stateSchema: globalStateSchema,
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
