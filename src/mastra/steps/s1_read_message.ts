import { createStep } from '@mastra/core/workflows';
import z from "zod";
import { ClassifyMessage } from "../agents/classify-message";
import { getUserContext } from "../utils";
import { AgUiContext, classificationOutput, globalStateSchema } from "./types";

const inputSchema = z.object({
  message: z.string().describe("The incoming message to be processed."),
});

export const readMessage = createStep({
  id: `ReadMessage`,
  description: "Read the incoming message and extract relevant information.",
  stateSchema: globalStateSchema,
  inputSchema,
  outputSchema: classificationOutput,
  execute: async ({
    mastra,
    inputData,
    state,
    runtimeContext,
    setState,
  }) => {
    console.log("Executing readMessage step...", inputData, state);
    const userContext = getUserContext(
      runtimeContext.get("ag-ui") as AgUiContext
    );

    // writer.write({
    //   type: "reasoning",
    //   step: "message classification",
    //   message:
    //     "User asked something, gathering context information to extracting topic, intent and summary...",
    // });

    if (userContext) {
      const { workspace, user, token } = userContext;
      setState({
        ...state,
        ...(workspace && {
          workspaceId: workspace.id,
          workspaceName: workspace.company,
        }),
        userId: user.profile_id,
        userName: user.name,
        jwt: token,
      });

      runtimeContext.set(
        "workspaceName",
        workspace.company || "Unknown Workspace"
      );
      runtimeContext.set("userName", user.name || "Unknown User");
    }

    console.log("User context:", userContext, inputData);

    const { message } = inputData;
    console.log("Reading message:", message);

    const classifyAgent = mastra.getAgent("ClassifyMessage");
    const stream = await classifyAgent.stream(message, {
      output: classificationOutput,
      memory: {
        resource: "e2e-supervisor",
        thread: "activity-planner",
      },
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
