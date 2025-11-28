import { createWorkflow } from '@mastra/core/workflows';
import z from "zod";
import { classificationOutput, globalStateSchema } from "../steps/types";
import { printResults } from "../steps/sN_print_results";
import { getTemplatesStep } from "../steps/plan_crafter/s1_get_templates";
import { chooseTemplateStep } from "../steps/plan_crafter/s4_choose_template";
import { analyzeContextStep } from "../steps/plan_crafter/s2_analyze_context";
import { aggregateStep } from "../steps/plan_crafter/s3_aggregate";

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
  .parallel([getTemplatesStep, analyzeContextStep])
  .then(aggregateStep)
  .dountil(
    chooseTemplateStep,
    async ({ inputData }) => inputData.templateFound === true
  )
  .map(async ({ inputData }) => {
    return {
      response: inputData.selection_rationale || "No rationale provided.",
    };
  })
  .then(printResults)
  .commit();
