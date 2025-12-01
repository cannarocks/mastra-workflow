import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { instructions } from "./prompt";
import { pageActTool } from "../../../tools/search/page-act-tool";
import { pageObserveTool } from "../../../tools/search/page-observe-tool";
import { pageExtractTool } from "../../../tools/search/page-extract-tool";
import { pageNavigateTool } from "../../../tools/search/page-navigate-tool";
import { LibSQLVector } from "@mastra/libsql";
import { getUserTemplates } from "../../../tools/api/getUserTemplates";

export const TemplateSelectorAgent = new Agent({
  id: "TemplateSelectorAgent",
  name: "Template Selector Agent",
  instructions: ({ runtimeContext, ...other }) => {
    const templates = runtimeContext.get("availableTemplates") || {};
    console.debug("🚀 ~ runtimeContext:", runtimeContext);
    console.debug("🚀 ~ templates:", templates);

    return `
    ${instructions} 
    
    ${Object.keys(templates).length > 0 ? `Available Templates: ${JSON.stringify(templates, null, 2)}` : ""}
    `;
  },
  model: openai("gpt-4.1"),
  tools: {
    pageActTool,
    pageObserveTool,
    pageExtractTool,
    pageNavigateTool,
  },
  memory: new Memory({
    vector: new LibSQLVector({
      connectionUrl: `file:../templateselector-agent.db`,
    }),
    embedder: openai.embedding("text-embedding-3-small"),
    options: {
      lastMessages: 10,
      semanticRecall: {
        topK: 10,
        messageRange: 5,
      },
    },
  }),
});
