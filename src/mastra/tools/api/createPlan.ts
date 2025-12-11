import { createTool } from "@mastra/core/tools";
import z from "zod";
import { operations } from "./schema";

type ApiResponse =
  operations["post-workspaces-wid-plans"]["responses"]["201"]["content"]["application/json"];

const postWorkspaceWidPlans = async ({
  workspace_id,
  template_id,
  project_id,
  jwt,
}: {
  workspace_id: number;
  template_id: number;
  project_id: number;
  jwt: string;
}) => {
  console.log(`Executing postWorkspaceWidPlans`, {
    workspace_id,
    template_id,
    project_id,
  });

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/workspaces/${workspace_id}/plans`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          template_id,
          project_id,
        }),
      }
    );
    if (!response.ok) {
      console.error(`Failed to createPlan: ${response.statusText}`);
      throw new Error(
        `Error creating plan: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as ApiResponse;

    return data.id;
  } catch (error) {
    console.error("Error createPlan:", error);
    return -1;
  }
};

export const createPlan = createTool({
  id: "createPlanTool",
  description:
    "create a test plan based on existing template_id in a specified workspace and project",
  inputSchema: z.object({
    workspace_id: z
      .number()
      .describe("The ID of the workspace to retrieve templates for."),
    template_id: z
      .number()
      .describe("The ID of the template to create the plan from."),
    project_id: z
      .number()
      .describe("The ID of the project to associate the plan with."),
    jwt: z.string().describe("JWT token for authentication."),
  }),
  outputSchema: z.number().describe("The ID of the newly created test plan."),
  execute: async ({
    context: { workspace_id, jwt, template_id, project_id },
  }) => {
    console.log(
      "Using Api to fetch template information for Workspace",
      workspace_id
    );

    const tempJWT =
      jwt ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJsdWNhLmNhbm5hcm96em9AdW5ndWVzcy5pbyIsInJvbGUiOiJhZG1pbmlzdHJhdG9yIiwidHJ5YmVyX3dwX3VzZXJfaWQiOjEsInVuZ3Vlc3Nfd3BfdXNlcl9pZCI6MSwicHJvZmlsZV9pZCI6MzIsImlhdCI6MTc2NTM4MzQ1MiwiZXhwIjoxNzY2MjgzNDUyfQ.We2rfFPS8ECbVBGIiWdgix7lhBtr7qWEBx1mGHED1c4";

    return await postWorkspaceWidPlans({
      workspace_id,
      project_id,
      template_id,
      jwt: tempJWT,
    });
  },
});
