import { registerCopilotKit } from "@ag-ui/mastra/copilotkit";
import { toAISdkFormat, workflowRoute } from "@mastra/ai-sdk";
import { Mastra } from "@mastra/core/mastra";
import { RuntimeContext } from "@mastra/core/runtime-context";
import { registerApiRoute } from "@mastra/core/server";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { createUIMessageStreamResponse } from "ai";
import { ClassifyMessage } from "./agents/classify-message";
import { FirstQuestionDesigner } from "./agents/templateSelector/FirstQuestionDesigner";
import { TemplateSelectorAgent } from "./agents/templateSelector/TemplateSelectorAgent";
import { WorkflowAgent } from "./agents/workflow";
import { E2ERuntimeContext } from "./steps/types";
import { parseMessages } from "./utils";
import { mainWorkflow } from "./workflows/e2e-workflow";
import { planCrafterWf } from "./workflows/plan_crafter";
import { supportWf } from "./workflows/support";
import { templateSelectorWf } from "./workflows/template_selector";
import { fillPlanWf } from "./workflows/fill_plan";
import { ConfirmTemplate } from "./agents/templateSelector/confirmTemplate";

export const mastra = new Mastra({
  storage: new LibSQLStore({
    url: "file:../../.storage/storage.db",
  }),
  agents: {
    WorkflowAgent,
    TemplateSelectorAgent,
    ConfirmTemplate,
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
  workflows: {
    mainWorkflow,
    planCrafterWf,
    supportWf,
    templateSelectorWf,
    fillPlanWf,
  },
  server: {
    cors: {
      origin: "*",
      allowMethods: ["*"],
      allowHeaders: ["*"],
    },
    apiRoutes: [
      registerCopilotKit<E2ERuntimeContext>({
        path: "/copilotkit",
        resourceId: "mainWorkflow",
        setContext: (c, runtimeContext) => {
          runtimeContext.set("availableTemplates", []);
        },
      }),
      registerApiRoute("/workflow", {
        method: "POST",
        handler: async (c) => {
          const { runId, resourceId, messages, context, ...rest } =
            await c.req.json();
          console.log("########## PROVOLA REQUEST ###########");

          const { lastUserMessage, lastStepName, activeRunId } =
            parseMessages(messages);
          console.debug(
            "🚀 ~ lastUserMessage, lastStepName, activeRunId:",
            lastUserMessage,
            lastStepName,
            activeRunId
          );
          const mastra = c.get("mastra");
          const wf = mastra.getWorkflow("mainWorkflow");
          const rt = new RuntimeContext();
          if (context) {
            rt.set("ag-ui", {
              context: [
                {
                  description: "app.user.context",
                  value: JSON.stringify(context),
                },
              ],
            });
          }

          if (!activeRunId) {
            console.log("Starting new workflow...");
            // starting a new workflow run
            const run = await wf.createRunAsync({ runId: activeRunId });
            const stream = run.stream({
              inputData: { message: lastUserMessage || "" },
              runtimeContext: rt,
            });

            return createUIMessageStreamResponse({
              stream: toAISdkFormat(stream, {
                from: "workflow",
              }),
            });
          }

          // resuming an existing workflow run
          console.log("Resuming workflow...", activeRunId);
          const run = await wf.createRunAsync({
            runId: activeRunId,
          });
          const stream = run.resumeStream({
            resumeData: { input: lastUserMessage },
            runtimeContext: rt,
          });
          return createUIMessageStreamResponse({
            stream: toAISdkFormat(stream, {
              from: "workflow",
            }),
          });
        },
      }),
    ],
  },
});
