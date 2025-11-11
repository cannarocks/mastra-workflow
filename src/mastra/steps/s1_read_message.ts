import { createStep } from "@mastra/core";
import z from "zod";
import { ClassifyMessage } from "../agents/classificator";
import { classificationOutput, globalStateSchema } from "./types";

const inputSchema = z.object({
  message: z.string().describe("The incoming message to be processed."),
});

export const readMessage = createStep({
  id: `ReadAndClassifyMessage`,
  description: "Read the incoming message and extract relevant information.",
  stateSchema: globalStateSchema,
  inputSchema,
  outputSchema: classificationOutput,
  execute: async ({ inputData, state }) => {
    console.log("Executing readMessage step...", inputData, state);
    const { message } = inputData;
    console.log("Reading message:", message);
    // const data = await ClassifyMessage.generate(message, {
    //   output: classificationOutput,
    // });

    // return {
    //   response: data.object.response,
    //   intent: data.object.intent,
    //   topic: data.object.topic,
    //   summary: data.object.summary,
    // };

    const stream = await ClassifyMessage.stream(message, {
      output: classificationOutput,
    });

    let lastChunk: any = {};
    for await (const chunk of stream.objectStream) {
      lastChunk = chunk;
    }

    return {
      response: lastChunk.response,
      intent: lastChunk.intent,
      topic: lastChunk.topic,
      summary: lastChunk.summary,
    };
  },
});
