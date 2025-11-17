import { createStep } from "@mastra/core";
import { RuntimeContext } from "@mastra/core/runtime-context";
import z from "zod";
import { TemplateSelectorAgent } from "../../agents/planCrafter/template-selector";
import {
  classificationOutput,
  E2ERuntimeContext,
  globalStateSchema,
  templateSelectionSchema,
} from "../types";
import { analyzeContextOutput } from "./s2_analyze_context";

const ACCEPTABLE_CONFIDENCE_THRESHOLD = 7;
const MAX_ITERATIONS = 5;

export const chooseTemplateStep = createStep({
  id: `chooseTemplate`,
  description:
    "Gather all the necessary information to choose the best template and start composing the test plan.",
  stateSchema: globalStateSchema,
  inputSchema: analyzeContextOutput.merge(templateSelectionSchema),
  outputSchema: classificationOutput.merge(templateSelectionSchema),
  resumeSchema: z.object({
    userMessage: z.string(),
  }),
  suspendSchema: z.object({
    suspendResponse: z.string(),
  }),
  execute: async ({
    inputData,
    state,
    writer,
    runtimeContext,
    suspend,
    resumeData,
    mastra,
  }) => {
    console.log("Executing chooseTemplate step...", inputData, state);

    const { iterations_used, first_question } = inputData;

    const { userMessage } = resumeData ?? {};

    if (!userMessage) {
      const suspendResponse =
        first_question ||
        "To help craft the best activity plan for your needs, could you please provide more information?";
      console.debug("🚀 ~ first_question:", first_question);
      return await suspend({
        suspendResponse,
      });
    }

    console.log("MESSAGGIO DI RESUME", userMessage);

    const rtContext = new RuntimeContext<E2ERuntimeContext>();
    rtContext.set("availableTemplates", state.availableTemplates || []);

    const templator = mastra.getAgent("TemplateSelectorAgent");
    const response = await templator.stream(
      [
        {
          role: "user",
          content: `The user said: "${userMessage}"
        Please respond appropriately. Check the available templates and select the best one for the user's needs or ask for more information if necessary.`,
        },
      ],
      {
        runtimeContext: rtContext,
        output: templateSelectionSchema.omit({ iterations_used: true }),
      }
    );

    let lastChunk: any = {};
    for await (const chunk of response.objectStream) {
      lastChunk = chunk;
    }

    return {
      ...inputData,
      selected_template_id: lastChunk.selected_template_id,
      confidence_score: lastChunk.confidence_score,
      selection_rationale: lastChunk.selection_rationale,
      templateFound:
        lastChunk.confidence_score >= ACCEPTABLE_CONFIDENCE_THRESHOLD,
      user_context_summary: lastChunk.user_context_summary,
      customization_suggestions: lastChunk.customization_suggestions,
      iterations_used: (iterations_used || 0) + 1,
      response: lastChunk.response,
    };
  },
});
