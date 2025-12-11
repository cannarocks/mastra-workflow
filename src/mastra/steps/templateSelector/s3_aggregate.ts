import { createStep } from "@mastra/core/workflows";
import z from "zod";
import {
  globalStateSchema,
  templateSelectionSchema
} from "../types";
import { templateStepOutput } from "./s1_get_templates";
import { analyzeContextOutput } from "./s2_analyze_context";


export const aggregateStep = createStep({
  id: `aggregateStep`,
  description:
    "Gather all the necessary information to choose the best template and start composing the test plan.",
  stateSchema: globalStateSchema,
  inputSchema: z.object({
    analyzeContext: analyzeContextOutput,
    getTemplates: templateStepOutput,
  }),
  outputSchema: analyzeContextOutput
    .merge(templateSelectionSchema)
    .merge(templateStepOutput),

  execute: async ({ inputData, state }) => {
    console.log("Executing aggregateStep step...", inputData);

    return {
      ...inputData.getTemplates,
      ...inputData.analyzeContext,
      confidence_score: 0,
      templateFound: false,
      iterations_used: 0,
      reasoning: `Aggregated data from context analysis and template selection.`,
    };
  },
});
