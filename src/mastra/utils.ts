import { UIMessage } from "ai";
import { AgUiContext, userRuntimeContextSchema } from "./steps/types";
import z from "zod";
import { WorkflowDataPart } from "@mastra/ai-sdk";

const DEFAULT_USER_CONTEXT = {
  user: {
    id: -1,
    email: "unknown",
    role: "unknown",
    profile_id: -1,
    tryber_wp_user_id: -1,
    unguess_wp_user_id: -1,
    name: "User",
    first_name: "User",
    last_name: "User",
    picture: "",
    features: [],
    customer_role: "unknown",
    company_size: "unknown",
  },
  workspace: {
    id: -1,
    company: "Generic Workspace",
  },
  token: "",
};

export const getUserContext = (runtimeContext: AgUiContext) => {
  if (!runtimeContext || !runtimeContext.context) {
    return DEFAULT_USER_CONTEXT;
  }
  const context = runtimeContext.context.find(
    (contextItem) => contextItem.description === "app.user.context"
  );
  if (context) {
    const value = JSON.parse(context.value) as z.infer<
      typeof userRuntimeContextSchema
    >;

    return value;
  }
};

export const parseMessages = (messages: UIMessage[]) => {
  const lastUserMessage = messages
    .findLast((m) => m.role === "user")
    ?.parts.find((p) => p.type === "text")?.text;

  // identify the most recent workflow interaction by scanning all message parts
  // for a "data-workflow" type.
  const lastWorkflowPart = messages
    .flatMap((m) => m.parts)
    .findLast((p): p is WorkflowDataPart => p.type === "data-workflow");
  console.debug("🚀 ~ parseMessages ~ lastWorkflowPart:", lastWorkflowPart)

  // steps where status is not success
  const lastStepName = Object.values(lastWorkflowPart?.data.steps || {}).find(
    (step) => step.status !== "success"
  )?.name;

  // Set the active run id:
  // - If the workflow finished successfully, clear the run id (set to undefined) so a new workflow can start.
  // - Otherwise, keep the run id of the last workflow part to allow resuming or tracking the current workflow.
  const activeRunId =
    lastWorkflowPart?.data?.status === "success"
      ? undefined
      : lastWorkflowPart?.id;

  return {
    lastStepName,
    lastUserMessage,
    activeRunId,
  };
};
