import { createTool } from "@mastra/core/tools";
import z from "zod";
import { operations } from "./schema";
import { moduleSchema } from "./zodSchema";

type Body =
  operations["patch-workspaces-wid-plans-pid"]["requestBody"]["content"]["application/json"];

const patchPlansByPid = async ({
  plan_id,
  configuration,
  jwt,
}: {
  plan_id: number;
  configuration: Body;
  jwt: string;
}) => {
  console.log(`Executing patchPlansByPid`, {
    plan_id,
    configuration,
  });

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/plans/${plan_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(configuration),
      }
    );
    if (!response.ok) {
      console.error(`Failed to patchPlan: ${response.statusText}`);
      throw new Error(
        `Error patching plan: ${response.status} ${response.statusText}`
      );
    }

    return true;
  } catch (error) {
    console.error("Error patchPlan:", error);
    return false;
  }
};

export const patchPlan = createTool({
  id: "patchPlanTool",
  description: "update a test plan's configuration by its ID",
  inputSchema: z.object({
    plan_id: z.number().describe("The ID of the plan to be updated."),
    configuration: z
      .object({
        config: z.object({
          modules: z.array(moduleSchema),
        }),
      })
      .describe("The new configuration for the test plan."),
    jwt: z.string().describe("JWT token for authentication."),
  }),
  outputSchema: z
    .boolean()
    .describe("Returns true if the plan was updated successfully."),
  execute: async ({ context: { plan_id, configuration, jwt } }) => {
    console.log("Using Api to patch plan information for Plan ID", plan_id);

    const tempJWT =
      jwt ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJsdWNhLmNhbm5hcm96em9AdW5ndWVzcy5pbyIsInJvbGUiOiJhZG1pbmlzdHJhdG9yIiwidHJ5YmVyX3dwX3VzZXJfaWQiOjEsInVuZ3Vlc3Nfd3BfdXNlcl9pZCI6MSwicHJvZmlsZV9pZCI6MzIsImlhdCI6MTc2NTM4MzQ1MiwiZXhwIjoxNzY2MjgzNDUyfQ.We2rfFPS8ECbVBGIiWdgix7lhBtr7qWEBx1mGHED1c4";

    return await patchPlansByPid({
      plan_id,
      configuration,
      jwt: tempJWT,
    });
  },
});
