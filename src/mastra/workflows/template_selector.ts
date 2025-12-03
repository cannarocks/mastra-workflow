import { createWorkflow } from "@mastra/core/workflows";
import { getTemplatesStep } from "../steps/templateSelector/s1_get_templates";
import { analyzeContextStep } from "../steps/templateSelector/s2_analyze_context";
import { aggregateStep } from "../steps/templateSelector/s3_aggregate";
import { chooseTemplateStep } from "../steps/templateSelector/s4_choose_template";
import { confirmStep } from "../steps/templateSelector/s5_confirm";
import {
    classificationOutput,
    globalStateSchema,
    templateSelectionSchema,
} from "../steps/types";

export const templateSelectorWf = createWorkflow({
  id: "select_template_workflow",
  description:
    "gather all necessary information to select the best template based on the user's request.",
  stateSchema: globalStateSchema,
  inputSchema: classificationOutput,
  outputSchema: templateSelectionSchema,
})
  .parallel([getTemplatesStep, analyzeContextStep])
  .then(aggregateStep)
  .dountil(
    chooseTemplateStep,
    async ({ inputData }) => inputData.templateFound === true
  )
  .then(confirmStep)
  .commit();
