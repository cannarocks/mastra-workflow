import { RuntimeContext } from "@mastra/core/runtime-context";
import { createStep } from "@mastra/core/workflows";
import z from "zod";
import {
  E2ERuntimeContext,
  globalStateSchema,
  templateSelectionSchema,
} from "../types";
import { templateStepOutput } from "./s1_get_templates";
import { analyzeContextOutput } from "./s2_analyze_context";

const ACCEPTABLE_CONFIDENCE_THRESHOLD = 7;

const testSchema = z.object({
  selected_template_id: z.string().nullable(),
  confidence_score: z.number().min(0).max(10).default(0),
  selection_rationale: z.string().nullable(),
  business_objective: z.string().nullable(),
  touchpoint_url: z.string().nullable(),
  touchpoint_analysis: z.string().nullable(),
  key_requirements: z.array(z.string()).nullable(),
  constraints: z.array(z.string()).nullable(),
  next_question: z.string(),
});

export const chooseTemplateStepSchema = analyzeContextOutput
  .merge(templateSelectionSchema)
  .merge(templateStepOutput);

export const chooseTemplateStep = createStep({
  id: `chooseTemplate`,
  description:
    "Gather all the necessary information to choose the best template and start composing the test plan.",
  stateSchema: globalStateSchema,
  inputSchema: chooseTemplateStepSchema,
  outputSchema: chooseTemplateStepSchema,
  resumeSchema: z.object({
    input: z.string(),
  }),
  execute: async ({ inputData, suspend, resumeData, mastra }) => {
    console.log("Executing chooseTemplate step...", inputData);

    const { iterations_used, next_question, templates } = inputData;

    const { input } = resumeData ?? {};

    if (!input) {
      const suspendResponse =
        next_question ||
        "To help craft the best activity plan for your needs, could you please provide more information?";
      console.debug("🚀 ~ next_question:", next_question);
      return await suspend({
        message: suspendResponse,
      });
    }

    const rtContext = new RuntimeContext<E2ERuntimeContext>();

    const templator = mastra.getAgent("TemplateSelectorAgent");
    const response = await templator.generate(
      [
        {
          role: "user",
          content: `The user said: "${input}"
          we already know the following context about the user needs:
          ${JSON.stringify(inputData.user_context_summary, null, 2)}
        Please respond appropriately. Check the available templates and select the best one for the user's needs or send a request to user with an additional question if necessary.`,
        },
        {
          role: "system",
          content: `availableTemplates: ${JSON.stringify(
            templates || [],
            null,
            2
          )}`,
        },
      ],
      {
        runtimeContext: rtContext,
        structuredOutput: {
          schema: testSchema,
          jsonPromptInjection: true,
        },
      }
    );

    const lastChunk = response.object;
    // for await (const chunk of response.objectStream) {
    //   lastChunk = chunk;
    // }

    return {
      ...inputData,
      selected_template_id: lastChunk?.selected_template_id ?? undefined,
      confidence_score: lastChunk?.confidence_score,
      selection_rationale: lastChunk?.selection_rationale,
      templateFound: lastChunk?.confidence_score
        ? lastChunk?.confidence_score >= ACCEPTABLE_CONFIDENCE_THRESHOLD
        : false,
      user_context_summary: {
        business_objective: lastChunk?.business_objective || "",
        touchpoint_url: lastChunk?.touchpoint_url || "",
        touchpoint_analysis: lastChunk?.touchpoint_analysis || "",
        key_requirements: lastChunk?.key_requirements || [],
        constraints: lastChunk?.constraints || [],
      },
      iterations_used: (iterations_used || 0) + 1,
      next_question: lastChunk?.next_question,
      reasoning: `Considerando le nuove informazioni, cerco un template adatto (confidenza ${lastChunk?.confidence_score}). Ricordiamoci sempre che ${lastChunk?.business_objective || "..."}`,
    };
  },
});
