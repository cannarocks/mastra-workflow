import z from "zod";
import { cpReqTemplateSchema } from "../tools/api/zodSchema";
import { CpReqTemplate } from "../tools/api/filtered";

export const globalStateSchema = z.object({
  workspaceId: z.number().describe("The ID of the workspace."),
  workspaceName: z.string().describe("The name of the workspace."),
  userId: z.number().describe("The ID of the user."),
  userName: z.string().describe("The name of the user."),
  jwt: z.string().describe("JWT for authentication."),
  planId: z.number().optional().describe("The ID of the test plan."),
  templateId: z.number().optional().describe("The ID of the template."),
});

const base = z.object({
  reasoning: z.string().optional(),
});

export const classificationOutput = base.merge(
  z.object({
    intent: z.enum(["support_request", "create_test_plan", "out_of_scope"]),
    topic: z.string(),
    summary: z.string(),
  })
);

export const templateSelectionSchema = base.merge(
  z.object({
    selected_template_id: z.string().optional(),
    confidence_score: z.number().min(0).max(10).default(0),
    templateFound: z.boolean().default(false),
    selection_rationale: z.string().optional(),
    user_context_summary: z
      .object({
        business_objective: z.string(),
        touchpoint_url: z.string(),
        touchpoint_analysis: z.string(),
        key_requirements: z.array(z.string()),
        constraints: z.array(z.string()),
      })
      .optional(),
    iterations_used: z.number().default(0),
  })
);

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
}

export type E2ERuntimeContext = {
  availableTemplates: Array<CpReqTemplate>;
  "ag-ui": AgUiContext;
};
