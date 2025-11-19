import { createWorkflow } from '@mastra/core/workflows';
import z from "zod";
import { classificationOutput, globalStateSchema } from "../steps/types";
import { printResults } from "../steps/sN_print_results";

export const supportWf = createWorkflow({
  id: "general_support_workflow",
  description:
    "Gather all necessary information to provide support based on the user's request.",
  stateSchema: globalStateSchema,
  inputSchema: classificationOutput,
  outputSchema: z.object({
    success: z
      .boolean()
      .describe("Indicates if the web action was successful."),
    details: z.string().describe("Details about the web action performed."),
  }),
})
  .map(async ({ inputData }) => {
    return {
      response: inputData.summary,
    };
  })
  .then(printResults)
  .commit();
