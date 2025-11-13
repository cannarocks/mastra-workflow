import { createStep } from "@mastra/core";
import z from "zod";
import { classificationOutput, globalStateSchema } from "../types";
import { cpReqTemplateSchema } from "../../tools/api/zodSchema";
import { getUserTemplates } from "../../tools/api/getUserTemplates";

export const getTemplatesStep = createStep({
  id: `getTemplates`,
  description: "Fetch available templates from the API.",
  stateSchema: globalStateSchema,
  inputSchema: classificationOutput,
  outputSchema: classificationOutput.merge(
    z.object({
      templates: z.array(cpReqTemplateSchema).describe("Available templates."),
    })
  ),
  resumeSchema: z.object({
    workspaceId: z
      .number()
      .describe("The ID of the workspace to retrieve templates for."),
  }),
  execute: async ({
    inputData,
    state,
    writer,
    runtimeContext,
    suspend,
    resumeData,
  }) => {
    console.log("Executing printResults step...", inputData, state);
    const { workspaceId: stateWorkspaceId } = state;
    const workspaceId = stateWorkspaceId || resumeData?.workspaceId;
    if (!workspaceId) {
      return await suspend({
        suspendResponse:
          "In order to find the best template for you, I need to know your workspace ID. Please provide it to continue.",
      });
    }

    writer.write({
      type: "reasoning",
      step: "retrieving available templates",
      message:
        "Fetching available templates from the UNGUESS backend service...",
    });

    const response = await getUserTemplates.execute({
      context: {
        workspaceId,
        jwt: state.jwt || "",
      },
      runtimeContext,
    });

    return {
      ...inputData,
      templates: response || [],
    };
  },
});
