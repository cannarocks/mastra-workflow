import { createStep } from "@mastra/core/workflows";
import z from "zod";
import { globalStateSchema } from "../types";
import { chooseTemplateStepSchema } from "./s4_choose_template";

export const confirmStep = createStep({
  id: `confirmStep`,
  description: "Confirm the selected template and prepare for finalization.",
  stateSchema: globalStateSchema,
  inputSchema: chooseTemplateStepSchema,
  outputSchema: chooseTemplateStepSchema,
  resumeSchema: z.object({
    input: z.string(),
  }),
  execute: async ({ inputData, state, resumeData, mastra, bail, suspend }) => {
    console.log("Executing confirmStep step...", inputData, state);
    const { selected_template_id, selection_rationale } = inputData;
    const { input } = resumeData ?? {};

    if (!input) {
      return await suspend({
        message: `${selection_rationale} Lo confermiamo?`,
      });
    }

    const agent = mastra.getAgent("ConfirmTemplate");

    const response = await agent.generate(
      [
        {
          role: "user",
          content: `The selected template ID is: ${selected_template_id}.the users says: "${input}".`,
        },
      ],
      {
        structuredOutput: {
          schema: z.object({
            isConfirmed: z.boolean().default(false),
          }),
          jsonPromptInjection: true,
        },
      }
    );

    const { isConfirmed } = response.object;

    if (!isConfirmed) {
      console.debug("User did not confirm the template.");
      bail(
        "Nessun problema, possiamo riprovare a selezionare un template diverso."
      );
    }

    return {
      ...inputData,
      reasoning: `L'utente ha ${isConfirmed ? "confermato" : "non confermato"} il template`,
    };
  },
});
