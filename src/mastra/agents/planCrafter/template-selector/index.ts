import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { instructions } from "./prompt";
import { pageActTool } from "../../../tools/search/page-act-tool";
import { pageObserveTool } from "../../../tools/search/page-observe-tool";
import { pageExtractTool } from "../../../tools/search/page-extract-tool";
import { pageNavigateTool } from "../../../tools/search/page-navigate-tool";
import { LibSQLVector } from "@mastra/libsql";
import path from "path";

export const TemplateSelectorAgent = new Agent({
  id: "TemplateSelectorAgent",
  name: "Template Selector Agent",
  instructions: ({ runtimeContext, ...other }) => {
    const templates = runtimeContext.get("availableTemplates") || [];

    return `
    ${instructions} 
    
    Available Templates: ${JSON.stringify(templates, null, 2)}
    `;
  },
  model: openai("o4-mini"),
  tools: { pageActTool, pageObserveTool, pageExtractTool, pageNavigateTool },
  memory: new Memory({
    vector: new LibSQLVector({
      connectionUrl: `file:${path.resolve(__dirname, "../../.storage/storage_workflow.db")}`,
    }),
    embedder: openai.embedding("text-embedding-3-small"),
    options: {
      lastMessages: 15,
      semanticRecall: {
        topK: 10,
        messageRange: 5,
      },
    },
  }),
});
