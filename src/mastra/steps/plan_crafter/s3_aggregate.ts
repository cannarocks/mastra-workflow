import { createStep } from '@mastra/core/workflows';
import z from "zod";
import { TemplateSelectorAgent } from "../../agents/planCrafter/template-selector";
import {
  classificationOutput,
  globalStateSchema,
  templateSelectionSchema,
} from "../types";
import { analyzeContextOutput } from "./s2_analyze_context";

const ACCEPTABLE_CONFIDENCE_THRESHOLD = 7;
const MAX_ITERATIONS = 5;

export const aggregateStep = createStep({
  id: `aggregateStep`,
  description:
    "Gather all the necessary information to choose the best template and start composing the test plan.",
  stateSchema: globalStateSchema,
  inputSchema: z.object({
    analyzeContext: analyzeContextOutput,
    getTemplates: templateSelectionSchema,
  }),
  outputSchema: analyzeContextOutput.merge(templateSelectionSchema),

  execute: async ({ inputData, state }) => {
    console.log("Executing aggregateStep step...", inputData, state);

    return {
      ...inputData.getTemplates,
      ...inputData.analyzeContext,
      reasoning: `Aggregated data from context analysis and template selection.`
    };
  },
});
