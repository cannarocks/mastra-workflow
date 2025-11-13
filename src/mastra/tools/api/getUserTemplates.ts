import { createTool } from "@mastra/core";
import z from "zod";
import { cpReqTemplateSchema } from "./zodSchema";

const getWorkspacesTemplates = async (workspaceId: number) => {
  // Simulate an API call to fetch templates for the given workspaceId
  console.log(`Fetching templates for workspace ID: ${workspaceId}`);
  // Here you would normally use fetch or axios to get data from an API
  return [
    {
      id: 1,
      category_id: 101,
      config: "{}",
      name: "Template A",
      description: "Description for Template A",
      price: undefined,
      strapi: undefined,
      workspace_id: workspaceId,
    },
    {
      id: 2,
      category_id: 102,
      config: "{}",
      name: "Template B",
      description: "Description for Template B",
      price: undefined,
      strapi: undefined,
      workspace_id: workspaceId,
    },
  ];
};

export const getUserTemplates = createTool({
  id: "user-templates",
  description: "Retrieve all available templates for a specific workspace.",
  inputSchema: z.object({
    workspaceId: z
      .number()
      .describe("The ID of the workspace to retrieve templates for."),
  }),
  outputSchema: z
    .array(cpReqTemplateSchema)
    .describe(
      "List of templates available in the workspace. Use this to create cpReqPlans (or any testing activity)"
    ),
  execute: async ({ context: { workspaceId }, ...otherProps }) => {
    console.log(
      "Using Api to fetch template information for Workspace",
      workspaceId
    );

    console.log("Other Props:", otherProps);
    return await getWorkspacesTemplates(workspaceId);
  },
});
