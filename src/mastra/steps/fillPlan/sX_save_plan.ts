import { createStep } from "@mastra/core";
import { addBusinessDays } from "date-fns";
import { globalStateSchema, planConfigurationSchema } from "../types";
import { patchPlan } from "../../tools/api/patchPlan";

export const savePlanStep = createStep({
  id: "SavePlanStep",
  stateSchema: globalStateSchema,
  inputSchema: planConfigurationSchema,
  outputSchema: planConfigurationSchema,
  description: "save current plan configuration.",
  async execute({ inputData, state, runtimeContext, bail, writer }) {
    console.log("Executing SetupPlanStep...");
    const { plan_id, config } = inputData;
    const { jwt } = state;

    if (!plan_id || !config) {
      console.error("Missing required information to update the plan:", {
        plan_id,
        config,
      });

      return bail({
        message: "Missing required information to update the plan.",
      });
    }

    // Check if config contains date module, if not add it
    const hasDateModule = config.modules.some(
      (module) => module.type === "dates"
    );
    if (!hasDateModule) {
      const dateModule = {
        type: "dates" as const,
        variant: "default",
        output: { start: addBusinessDays(new Date(), 1).toISOString() },
      };
      config.modules.push(dateModule);
      console.log("Added date module to plan configuration:", dateModule);
    }

    const response = await patchPlan.execute({
      context: {
        plan_id,
        configuration: {
          config,
        },
        jwt: jwt || "",
      },
      runtimeContext,
    });

    // Implement the logic for post plan processing here
    writer.write({
      type: "info",
      step: "post plan processing",
      message: "Post plan processing completed.",
    });

    return {
      ...inputData,
      reasoning: `${response ? "✅ Successfully updated" : "❌ Something went wrong with"} plan configuration with ${inputData.reasoning.charAt(0).toLowerCase()}${inputData.reasoning.slice(1)}`,
      plan_id,
    };
  },
});
