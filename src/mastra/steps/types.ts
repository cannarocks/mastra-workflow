import z from "zod";

export const classificationOutput = z.object({
  response: z.string(),
  intent: z.enum(["support_request", "create_test_plan"]),
  topic: z.string(),
  summary: z.string(),
});

export const globalStateSchema = z.object({
  workspaceId: z.number().describe("The ID of the workspace."),
  workspaceName: z.string().describe("The name of the workspace."),
  userId: z.number().describe("The ID of the user."),
  userName: z.string().describe("The name of the user."),
  jwt: z.string().describe("JWT for authentication."),
  planId: z.number().optional().describe("The ID of the test plan."),
  templateId: z.number().optional().describe("The ID of the template."),
});

/**
 * This will change after moving client chat behind unguess-api
 */
export const userRuntimeContextSchema = z.object({
  user: z.object({
    id: z.number(),
    email: z.string(),
    role: z.string(),
    profile_id: z.number(),
    tryber_wp_user_id: z.number(),
    unguess_wp_user_id: z.number(),
    name: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    picture: z.string().url(),
    features: z.array(
      z.object({
        slug: z.string(),
        name: z.string(),
      })
    ),
    customer_role: z.string(),
    company_size: z.string(),
  }),
  workspace: z.object({
    id: z.number(),
    company: z.string(),
  }),
  token: z.string(),
});

export interface AgUiContext {
  context: {
    description: string;
    value: string;
  }[];
  // add other properties as needed
}
