import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { instructions } from "./prompt";

export const ClassifyMessage = new Agent({
  name: "Message Classificator",
  instructions: async ({ runtimeContext }) => {
    const workspacename = runtimeContext.get("workspaceName");
    const userName = runtimeContext.get("userName");

    return `${instructions} \n\n you know that you are talking with ${userName} from the workspace ${workspacename} and today is ${Date.now().toLocaleString()}. Use this information to better contextualize your answers.`;
  },
  model: openai("o4-mini"),
  tools: {},
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
});
