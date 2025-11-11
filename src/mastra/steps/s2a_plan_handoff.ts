import { createStep } from "@mastra/core";
import z from "zod";
import { planCrafterWf } from "../workflows/plan-crafter";
import { classificationOutput, globalStateSchema } from "./types";

export const handoffToPlanCrafter = createStep({
  id: `handoffToPlanCrafter`,
  description: "Handoff classified message to plan crafter workflow.",
  stateSchema: globalStateSchema,
  inputSchema: classificationOutput,
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async (context) => {
    const { inputData, state, writer } = context;
    console.log("Executing handoffToPlanCrafter step...", inputData, state);
    writer.write({
      message: "Handoff to ActivityCrafter initiated.",
    });

    // const crafterWf = getWorkflow(planCrafterWf);

    const results = await planCrafterWf.execute(context);
    console.log("Reading response:", results);

    return {
      message: results.details,
    };
  },
});
