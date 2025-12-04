import { createStep } from "@mastra/core";
import z from "zod";
import { fillPlanInputSchema, globalStateSchema } from "../types";

export const postPlanStep = createStep({
  id: "PostPlanStep",
  stateSchema: globalStateSchema,
  inputSchema: fillPlanInputSchema.merge(
    z.object({
      project_id: z
        .string()
        .describe("The ID of the selected or created project."),
    })
  ),
  outputSchema: fillPlanInputSchema
    .merge(
      z.object({
        plan_id: z.string().describe("The ID of the brand new created plan."),
      })
    )
    .omit({ selected_template_id: true }),
  description: "A step to create a plan based on the chosed template.",
  async execute({
    mastra,
    inputData,
    state,
    runtimeContext,
    setState,
    writer,
  }) {
    console.log("Executing postPlanStep...", inputData);
    const { project_id, selected_template_id, ...rest } = inputData;
    // Implement the logic for post plan processing here
    writer.write({
      type: "info",
      step: "post plan processing",
      message: "Post plan processing completed.",
    });
    return {
      ...rest,
      plan_id: "newly_created_plan_id_12345",
    };
  },
});
