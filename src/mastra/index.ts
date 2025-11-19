import { registerCopilotKit } from "@ag-ui/mastra/copilotkit";
import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import path from "path";
import { famousPersonAgent } from "./agents/game/famous-person";
import { gameAgent } from "./agents/game/game-agent";
import { TemplateSelectorAgent } from "./agents/planCrafter/template-selector";
import { WorkflowAgent } from "./agents/workflow";
import { E2ERuntimeContext } from "./steps/types";
import { mainWorkflow } from "./workflows/e2e-workflow";
import { headsUpWorkflow } from "./workflows/game-test";
import { planCrafterWf } from "./workflows/plan-crafter";
import { supportWf } from "./workflows/support";
import { FirstQuestionDesigner } from "./agents/planCrafter/FirstQuestionDesigner";
import { ClassifyMessage } from "./agents/classify-message";
import { chatRoute, workflowRoute } from "@mastra/ai-sdk";

export const mastra = new Mastra({
  storage: new LibSQLStore({
    url: `file:${path.resolve(__dirname, "../../.storage/storage.db")}`,
  }),
  agents: {
    WorkflowAgent,
    TemplateSelectorAgent,
    FirstQuestionDesigner,
    ClassifyMessage,
  },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  observability: {
    default: { enabled: true },
  },
  workflows: { mainWorkflow, planCrafterWf, supportWf },
  server: {
    cors: {
      origin: "*",
      allowMethods: ["*"],
      allowHeaders: ["*"],
    },
    apiRoutes: [
      registerCopilotKit<E2ERuntimeContext>({
        path: "/copilotkit",
        resourceId: "TemplateSelectorAgent",
        setContext: (c, runtimeContext) => {
          runtimeContext.set("availableTemplates", []);
        },
      }),
      workflowRoute({
        path: "/workflow",
        workflow: "mainWorkflow",
      }),
    ],
  },
});
