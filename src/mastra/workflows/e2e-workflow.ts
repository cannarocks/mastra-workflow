import { createWorkflow } from '@mastra/core/workflows';
import z from "zod";
import { readMessage } from "../steps/s1_read_message";
import { globalStateSchema } from "../steps/types";
import { planCrafterWf } from "./plan-crafter";
import { supportWf } from "./support";

export const mainWorkflow = createWorkflow({
  id: "e2e_supervisor_workflow",
  description:
    "An end-to-end workflow to process messages and perform web actions.",
  stateSchema: globalStateSchema,
  inputSchema: z.object({
    message: z.string(),
  }),
  outputSchema: z.object({
    success: z
      .boolean()
      .describe("Indicates if the web action was successful."),
    details: z.string().describe("Details about the web action performed."),
  }),
})
  .then(readMessage)
  .branch([
    [
      async ({ inputData: { intent } }) => intent === "create_test_plan",
      planCrafterWf,
    ],
    [
      async ({ inputData: { intent } }) => intent === "support_request",
      supportWf,
    ],
    [async ({ inputData: { intent } }) => intent === "out_of_scope", supportWf],
  ])
  .commit();
