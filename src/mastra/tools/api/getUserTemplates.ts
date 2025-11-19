import { createTool } from '@mastra/core/tools';
import z from "zod";
import { StrapiTemplate } from "./filtered";
import { operations } from "./schema";
import { cpReqTemplateSchema } from "./zodSchema";

type ApiResponse =
  operations["get-workspaces-templates"]["responses"]["200"]["content"]["application/json"];

const getWorkspacesTemplates = async (workspaceId: number, jwt: string) => {
  console.log(`Fetching templates for workspace ID: ${workspaceId}`);

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/workspaces/${workspaceId}/templates`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (!response.ok) {
      console.error(`Failed to fetch templates: ${response.statusText}`);
      throw new Error(
        `Error fetching templates: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as ApiResponse;

    if (!data.items || !Array.isArray(data.items)) {
      console.error("Invalid data format: 'items' is missing or not an array");
      return [];
    }

    // Map/normalize each item to match cpReqTemplateSchema
    return data.items.map((item) => {
      const strapi = (item.strapi as StrapiTemplate) || {};
      return {
        ...item,
        strapi: {
          ...strapi,
          price: strapi.price
            ? {
                price: strapi.price.price ?? "",
                is_strikethrough:
                  typeof strapi.price.is_strikethrough === "number"
                    ? strapi.price.is_strikethrough
                    : 0, // Always a number
                previous_price: strapi.price.previous_price,
              }
            : undefined,
          title: strapi.title ?? "",
          pre_title: strapi.pre_title ?? "",
          tags: strapi.tags ?? [],
          description: strapi.description ?? "",
        },
      };
    });
  } catch (error) {
    console.error("Error in getWorkspacesTemplates:", error);
    return [];
  }
};

export const getUserTemplates = createTool({
  id: "get-available-templates",
  description: "Retrieve all available templates for a specific workspace.",
  inputSchema: z.object({
    workspaceId: z
      .number()
      .describe("The ID of the workspace to retrieve templates for."),
    jwt: z.string().describe("JWT token for authentication."),
  }),
  outputSchema: z
    .array(cpReqTemplateSchema)
    .describe(
      "List of templates available in the workspace. Use this to create cpReqPlans (or any testing activity)"
    ),
  execute: async ({ context: { workspaceId, jwt } }) => {
    console.log(
      "Using Api to fetch template information for Workspace",
      workspaceId
    );

    return await getWorkspacesTemplates(workspaceId, jwt);
  },
});
