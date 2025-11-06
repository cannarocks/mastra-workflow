import { createStep } from "@mastra/core";
import { WF_PREFIX } from "../costants";
import z from "zod";

const inputSchema = z.object({
  message: z.string().describe("The incoming message to be processed."),
});

export const readMessage = createStep({
  id: `${WF_PREFIX}_print_results`,
  description: "return the results of message classificator.",
  inputSchema,
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ inputData, state }) => {
    console.log("Executing readMessage step...", inputData, state);
    const { message } = inputData;
    console.log("Reading message:", message);

    return {
      message,
    };
  },
});
