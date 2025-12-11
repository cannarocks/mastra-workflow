import { createWorkflow } from "@mastra/core/workflows";
import z from "zod";
import { selectProjectStep } from "../steps/fillPlan/s1_select_project";
import { postPlanStep } from "../steps/fillPlan/s2_post_plan";
import { printResults } from "../steps/sN_print_results";
import { fillPlanInputSchema, globalStateSchema } from "../steps/types";
import { setupPlanStep } from "../steps/fillPlan/s3_setup_plan";
import { savePlanStep } from "../steps/fillPlan/sX_save_plan";
import { printPlanResults } from "../steps/fillPlan/s6_print_results";
import { generateTasksStep } from "../steps/fillPlan/s5_generate_tasks";
import { defineTargetStep } from "../steps/fillPlan/s4_define_target";

export const fillPlanWf = createWorkflow({
  id: "fill_plan_workflow",
  description:
    "From defined template, create a detailed test plan based on the user's request.",
  stateSchema: globalStateSchema,
  inputSchema: fillPlanInputSchema,
  outputSchema: z.object({
    success: z
      .boolean()
      .describe("Indicates if the web action was successful."),
    details: z.string().describe("Details about the web action performed."),
  }),
})
  .then(selectProjectStep)
  .then(postPlanStep)
  .then(setupPlanStep)
  .then(savePlanStep)
  .then(defineTargetStep)
  .then(savePlanStep)
  .then(generateTasksStep)
  .then(savePlanStep)
  .then(printPlanResults)
  .commit();
