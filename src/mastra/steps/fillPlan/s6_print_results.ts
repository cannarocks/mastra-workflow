import { createStep } from "@mastra/core/workflows";
import z from "zod";
import { globalStateSchema, planConfigurationSchema } from "../types";

export const printPlanResults = createStep({
  id: `printPlanResults`,
  description: "return the results of plan configuration",
  stateSchema: globalStateSchema,
  inputSchema: planConfigurationSchema,
  outputSchema: z.object({
    success: z
      .boolean()
      .describe("Indicates if the web action was successful."),
    message: z.string().describe("Details about the web action performed."),
    plan_id: z.number().describe("The ID of the created plan."),
  }),
  execute: async ({ inputData }) => {
    console.log("Executing printPlanResults step...", inputData);

    return {
      success: true,
      message: `Plan configured successfully with ID: ${inputData.plan_id}`,
      plan_id: inputData.plan_id,
    };
  },
});
