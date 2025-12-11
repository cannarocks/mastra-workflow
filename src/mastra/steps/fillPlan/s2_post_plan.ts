import { createStep } from "@mastra/core";
import z from "zod";
import { createPlan } from "../../tools/api/createPlan";
import {
  fillPlanInputSchema,
  globalStateSchema,
  planConfigurationSchema,
} from "../types";
import { getPlan } from "../../tools/api/getPlan";

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
  outputSchema: planConfigurationSchema,
  description: "A step to create a plan based on the chosed template.",
  async execute({
    inputData,
    resumeData,
    suspend,
    state,
    runtimeContext,
    bail,
    writer,
  }) {
    console.log("Executing postPlanStep...");
    const { project_id, selected_template_id } = inputData;
    const { workspaceId: stateWorkspaceId, jwt } = state;

    const workspaceId =
      stateWorkspaceId || Number.parseInt(resumeData?.workspaceId, 10);

    if (!workspaceId) {
      return await suspend({
        suspendResponse:
          "In order to find the best template for you, I need to know your workspace ID. Please provide it to continue.",
      });
    }

    if (!selected_template_id || !project_id) {
      console.error("Missing required information to create a plan:", {
        workspaceId,
        selected_template_id,
        project_id,
        jwt,
      });

      return bail({
        message: "Missing required information to create a plan.",
      });
    }

    const plan_id = await createPlan.execute({
      context: {
        workspace_id: workspaceId,
        jwt: jwt!,
        template_id: selected_template_id,
        project_id: Number.parseInt(project_id, 10),
      },
      runtimeContext,
    });

    // Implement the logic for post plan processing here
    writer.write({
      type: "info",
      step: "post plan processing",
      message: "Post plan processing completed.",
    });

    const planObj = await getPlan.execute({
      context: {
        plan_id,
        jwt: jwt!,
      },
      runtimeContext,
    });

    if (!planObj || !planObj.id) {
      return bail({
        message: "Failed to retrieve the created plan details.",
      });
    }

    return {
      ...inputData,
      config: planObj.config,
      reasoning: `Created plan with ID: ${plan_id} in project ID: ${project_id}`,
      plan_id,
    };
  },
});
