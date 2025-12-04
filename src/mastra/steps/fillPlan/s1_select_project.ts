import { createStep } from "@mastra/core/workflows";
import z from "zod";
import { fillPlanInputSchema, globalStateSchema } from "../types";

export const selectProjectStep = createStep({
  id: "selectProjectStep",
  description: "Prompt the user to select a project or create a new one.",
  stateSchema: globalStateSchema,
  inputSchema: fillPlanInputSchema,
  outputSchema: fillPlanInputSchema.merge(
    z.object({
      project_id: z
        .string()
        .describe("The ID of the selected or created project."),
    })
  ),
  resumeSchema: z.object({
    input: z.string(),
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    console.log("Executing selectProjectStep step...", inputData);

    const { input } = resumeData ?? {};

    if (!input) {
      return await suspend({
        message: `Con quale progetto vuoi associare questo piano di test? Puoi fornire un ID di progetto esistente o creane uno nuovo`,
      });
    }

    return {
      ...inputData,
      reasoning: `L'utente ha scelto di creare l'attività nel progetto con ID: ${input}`,
    };
  },
});
