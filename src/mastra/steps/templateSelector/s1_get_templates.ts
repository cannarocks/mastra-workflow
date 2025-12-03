import { createStep } from "@mastra/core/workflows";
import z from "zod";
import { getUserTemplates } from "../../tools/api/getUserTemplates";
import { cpReqTemplateSchema } from "../../tools/api/zodSchema";
import { classificationOutput, globalStateSchema } from "../types";

export const templateStepOutput = z.object({
  templates: z
    .array(cpReqTemplateSchema)
    .describe("List of templates retrieved from the API."),
  reasoning: z.string().describe("Reasoning behind fetching templates."),
});

export const getTemplatesStep = createStep({
  id: "getTemplates",
  description: "Fetch available templates from the API.",
  stateSchema: globalStateSchema,
  inputSchema: classificationOutput,
  outputSchema: templateStepOutput,
  execute: async ({
    inputData,
    state,
    runtimeContext,
    suspend,
    resumeData,
    setState,
  }) => {
    console.log("Executing getTemplates step...", inputData, state);
    const { workspaceId: stateWorkspaceId } = state;
    const workspaceId = stateWorkspaceId || resumeData?.workspaceId;
    if (!workspaceId) {
      return await suspend({
        suspendResponse:
          "In order to find the best template for you, I need to know your workspace ID. Please provide it to continue.",
      });
    }

    // writer.write({
    //   type: "reasoning",
    //   step: "retrieving available templates",
    //   message:
    //     "Fetching available templates from the UNGUESS backend service...",
    // });

    const response = await getUserTemplates.execute({
      context: {
        workspaceId,
        jwt: state.jwt || "",
      },
      runtimeContext,
    });
    console.debug("🚀 ~ response getUserTemplates:", response);

    // if (!response || response.length === 0) {
    //   writer.write({
    //     type: "error",
    //     step: "retrieving available templates",
    //     message:
    //       "No templates were found for the specified workspace. Please ensure that templates are available.",
    //   });
    // }

    return {
      templates: response || [],
      reasoning: `Fetched ${response?.length || 0} templates for workspace ID ${workspaceId}.`,
    };
  },
});
