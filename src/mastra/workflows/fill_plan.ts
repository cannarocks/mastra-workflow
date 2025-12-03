import { createWorkflow } from "@mastra/core/workflows";
import z from "zod";
import { printResults } from "../steps/sN_print_results";
import { globalStateSchema, templateSelectionSchema } from "../steps/types";

const inputSchema = templateSelectionSchema
  .omit({
    selected_template_id: true,
    iterations_used: true,
  })
  .merge(
    z.object({
      reasoning: z
        .string()
        .describe("The reasoning behind the template selection."),
    })
  );

export const fillPlanWf = createWorkflow({
  id: "fill_plan_workflow",
  description:
    "From defined template, create a detailed test plan based on the user's request.",
  stateSchema: globalStateSchema,
  inputSchema,
  outputSchema: z.object({
    success: z
      .boolean()
      .describe("Indicates if the web action was successful."),
    details: z.string().describe("Details about the web action performed."),
  }),
})
  .map(async ({ inputData }) => {
    return {
      response: inputData.reasoning,
    };
  })
  .then(printResults)
  .commit();
