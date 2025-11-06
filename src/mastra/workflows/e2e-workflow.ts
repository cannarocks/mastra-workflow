import { createStep, createWorkflow } from "@mastra/core";
import z from "zod";
import { readMessage } from "../steps/s1_read_message";
import { ClassifyMessage } from "../agents/classificator";

export const workflow = createWorkflow({
  id: "e2e_supervisor_workflow",
  description:
    "An end-to-end workflow to process messages and perform web actions.",
  stateSchema: z.object({
    workspaceId: z.string().describe("The ID of the workspace."),
    jwt: z.string().describe("JWT for authentication."),
  }),
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
  // .map(async ({ inputData }) => {
  //   const { message: prompt } = inputData;
  //   return {
  //     text: prompt,
  //   };
  // })
  .then(readMessage)
  .commit();
