import { registerCopilotKit } from "@ag-ui/mastra/copilotkit";
import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import path from "path";
import { WorkflowAgent } from "./agents/workflow";
import { mainWorkflow } from "./workflows/e2e-workflow";
import { planCrafterWf } from "./workflows/plan-crafter";
import { supportWf } from "./workflows/support";

type RuntimeContext = {
  "user-id": string;
};

export const mastra = new Mastra({
  storage: new LibSQLStore({
    url: `file:${path.resolve(__dirname, "../../.storage/storage.db")}`,
  }),
  agents: { WorkflowAgent },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  observability: {
    default: {
      enabled: true,
    },
  },
  workflows: { mainWorkflow, planCrafterWf, supportWf },
  server: {
    cors: {
      origin: "*",
      allowMethods: ["*"],
      allowHeaders: ["*"],
    },
    apiRoutes: [
      registerCopilotKit<RuntimeContext>({
        path: "/copilotkit",
        resourceId: "WorkflowAgent",
        setContext: (c, runtimeContext) => {
          runtimeContext.set(
            "user-id",
            c.req.header("X-User-ID") || "anonymous"
          );
        },
      }),
    ],
  },
});
