import { Agent } from "@mastra/core/agent";
import { instructions } from "./prompt";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";

export const ClassifyMessage = new Agent({
  name: "Message Classificator",
  instructions,
  model: openai("o4-mini"),
  tools: {},
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
});
