import z from "zod";

export const classificationOutput = z.object({
  response: z.string(),
  intent: z.enum(["support_request", "create_test_plan"]),
  topic: z.string(),
  summary: z.string(),
});

export const globalStateSchema = z.object({
  workspaceId: z.string().describe("The ID of the workspace."),
  jwt: z.string().describe("JWT for authentication."),
});
