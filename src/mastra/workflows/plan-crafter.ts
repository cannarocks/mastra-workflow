import { createWorkflow } from "@mastra/core";
import z from "zod";
import { classificationOutput, globalStateSchema } from "../steps/types";
import { printResults } from "../steps/sN_print_results";
import { getTemplatesStep } from "../steps/plan_crafter/s1_get_templates";

export const planCrafterWf = createWorkflow({
  id: "create_activity_workflow",
  description:
    "gather all necessary information to create a plan based on the user's request.",
  stateSchema: globalStateSchema,
  inputSchema: classificationOutput,
  outputSchema: z.object({
    success: z
      .boolean()
      .describe("Indicates if the web action was successful."),
    details: z.string().describe("Details about the web action performed."),
  }),
})
  .then(getTemplatesStep)
  .map(async ({ inputData }) => {
    return {
      response: inputData.response,
    };
  })
  .then(printResults)
  .commit();
