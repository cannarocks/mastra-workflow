import { createStep } from "@mastra/core";
import z from "zod";
import { ClassifyMessage } from "../agents/classificator";
import {
  AgUiContext,
  classificationOutput,
  globalStateSchema,
  userRuntimeContextSchema,
} from "./types";
import { getUserContext } from "../utils";

const inputSchema = z.object({
  message: z.string().describe("The incoming message to be processed."),
});

export const readMessage = createStep({
  id: `ReadAndClassifyMessage`,
  description: "Read the incoming message and extract relevant information.",
  stateSchema: globalStateSchema,
  inputSchema,
  outputSchema: classificationOutput,
  execute: async ({ inputData, state, writer, runtimeContext, setState }) => {
    console.log("Executing readMessage step...", inputData, state);
    const userContext = getUserContext(
      runtimeContext.get("ag-ui") as AgUiContext
    );

    writer.write({
      type: "reasoning",
      step: "message classification",
      message:
        "User asked something, gathering context information to extracting topic, intent and summary...",
    });

    if (userContext) {
      const { workspace, user, token } = userContext;
      setState({
        ...state,
        workspaceId: workspace.id,
        workspaceName: workspace.company,
        userId: user.profile_id,
        userName: user.name,
        jwt: token,
      });

      console.log("state updated:", state);
    }

    const { message } = inputData;
    console.log("Reading message:", message);

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
