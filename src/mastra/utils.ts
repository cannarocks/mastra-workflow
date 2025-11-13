import { AgUiContext, userRuntimeContextSchema } from "./steps/types";
import z from "zod";

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
