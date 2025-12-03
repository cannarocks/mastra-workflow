import { createWorkflow } from "@mastra/core/workflows";
import z from "zod";
import { classificationOutput, globalStateSchema } from "../steps/types";
import { fillPlanWf } from "./fill_plan";
import { templateSelectorWf } from "./template_selector";

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
  .then(templateSelectorWf)
  .map(async ({ inputData }) => {
    const { selected_template_id, selection_rationale, user_context_summary } =
      inputData;

    return {
      selected_template_id,
      selection_rationale,
      user_context_summary,
      reasoning: inputData.reasoning || "Template confirmed by user.",
    };
  })
  .then(fillPlanWf)
  .commit();
