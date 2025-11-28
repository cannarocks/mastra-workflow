import { createStep } from "@mastra/core/workflows";
import { getUserTemplates } from "../../tools/api/getUserTemplates";
import {
  classificationOutput,
  globalStateSchema,
  templateSelectionSchema,
} from "../types";

export const getTemplatesStep = createStep({
  id: "getTemplates",
  description: "Fetch available templates from the API.",
  stateSchema: globalStateSchema,
  inputSchema: classificationOutput,
  outputSchema: templateSelectionSchema,
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

    setState({
      ...state,
      availableTemplates: [
        ...(state.availableTemplates ?? []),
        ...(response ?? []),
      ],
    });

    return {
      ...inputData,
      reasoning: `Fetched ${response?.length || 0} templates for workspace ID ${workspaceId}.`,
    };
  },
});
