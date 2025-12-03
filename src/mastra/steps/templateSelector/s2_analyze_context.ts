import { createStep } from "@mastra/core/workflows";
import z from "zod";
import { classificationOutput, globalStateSchema } from "../types";

export const analyzeContextOutput = classificationOutput.merge(
  z.object({
    next_question: z.string(),
  })
);

export const analyzeContextStep = createStep({
  id: `analyzeContext`,
  description: "Check what we need from the user to choose the best template.",
  stateSchema: globalStateSchema,
  inputSchema: classificationOutput,
  outputSchema: analyzeContextOutput,
  execute: async ({ inputData, runtimeContext, mastra }) => {
    console.log("Executing analyzeContext step...", inputData);

    const { intent, topic, summary } = inputData;
    const request = `Based on user intent: "${intent}", topic: "${topic}", and summary: "${summary}, analyze input."`;

    const designer = mastra.getAgent("FirstQuestionDesigner");
    const response = await designer.stream(
      [
        {
          role: "system",
          content: request,
        },
        {
          role: "user",
          content: "Qual è la prima domanda che faresti?",
        },
      ],
      {
        runtimeContext,
        output: z.object({
          next_question: z.string(),
        }),
      }
    );

    let lastChunk: any = {};
    for await (const chunk of response.objectStream) {
      lastChunk = chunk;
    }

    return {
      ...inputData,
      next_question: lastChunk.next_question,
      reasoning: (await response.reasoning).toString() || "Analyze input context and determine next question",
    };
  },
});
