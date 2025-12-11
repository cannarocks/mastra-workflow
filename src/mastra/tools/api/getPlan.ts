import { createTool } from "@mastra/core/tools";
import z from "zod";
import { operations } from "./schema";
import { cpReqPlansSchema } from "./zodSchema";

type ApiResponse =
  operations["get-workspaces-wid-plans-pid"]["responses"]["200"]["content"]["application/json"];

const getPlansPid = async ({
  plan_id,
  jwt,
}: {
  plan_id: number;
  jwt: string;
}) => {
  console.log(`Executing getPlansPid`, {
    plan_id,
  });

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/plans/${plan_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (!response.ok) {
      console.error(`Failed to getPlan: ${response.statusText}`);
      throw new Error(
        `Error getting plan: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as ApiResponse;

    return data;
  } catch (error) {
    console.error("Error getPlan:", error);
    return {} as ApiResponse;
  }
};

export const getPlan = createTool({
  id: "getPlanTool",
  description: "retrieve a test plan's information by its ID",
  inputSchema: z.object({
    plan_id: z.number().describe("The ID of the plan to be retrieved."),
    jwt: z.string().describe("JWT token for authentication."),
  }),
  outputSchema: cpReqPlansSchema,
  execute: async ({ context: { plan_id, jwt } }) => {
    console.log("Using Api to fetch plan information for Plan ID", plan_id);

    const tempJWT =
      jwt ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJsdWNhLmNhbm5hcm96em9AdW5ndWVzcy5pbyIsInJvbGUiOiJhZG1pbmlzdHJhdG9yIiwidHJ5YmVyX3dwX3VzZXJfaWQiOjEsInVuZ3Vlc3Nfd3BfdXNlcl9pZCI6MSwicHJvZmlsZV9pZCI6MzIsImlhdCI6MTc2NTM4MzQ1MiwiZXhwIjoxNzY2MjgzNDUyfQ.We2rfFPS8ECbVBGIiWdgix7lhBtr7qWEBx1mGHED1c4";

    return await getPlansPid({
      plan_id,
      jwt: tempJWT,
    });
  },
});
