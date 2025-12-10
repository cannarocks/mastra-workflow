import { createStep } from "@mastra/core";
import z from "zod";
import { moduleSchema } from "../../tools/api/zodSchema";
import { globalStateSchema, planConfigurationSchema } from "../types";

export const setupPlanStep = createStep({
  id: "SetupPlanStep",
  stateSchema: globalStateSchema,
  inputSchema: planConfigurationSchema,
  outputSchema: planConfigurationSchema,
  description: "Update title, goals and touchpoints of the created plan.",
  async execute({ inputData, mastra, bail }) {
    console.log("Executing SetupPlanStep...");
    const { plan_id, config, user_context_summary } = inputData;

    if (!plan_id || !config) {
      console.error("Missing required information to update the plan:", {
        plan_id,
        config,
      });

      return bail({
        message: "Missing required information to update the plan.",
      });
    }

    const setupAgent = mastra.getAgent("SetupPlan");
    const response = await setupAgent.generate(
      [
        {
          role: "user",
          content: `Update plan_id: ${plan_id}, current info are:
          user_context_summary: ${JSON.stringify(user_context_summary)} 
          current configuration: ${JSON.stringify(config, null, 2)}.`,
        },
      ],
      {
        structuredOutput: {
          schema: z.object({
            config: z.object({
              modules: z.array(moduleSchema),
            }),
          }),
          jsonPromptInjection: true,
        },
      }
    );

    const lastChunk = response.object;

    return {
      ...inputData,
      config: lastChunk.config,
      reasoning: `Updated plan title, goal and touchpoints`,
      plan_id,
    };
  },
});
