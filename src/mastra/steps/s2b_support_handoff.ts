import { createStep } from "@mastra/core";
import z from "zod";
import { supportWf } from "../workflows/support";
import { classificationOutput, globalStateSchema } from "./types";

export const handoffToSupport = createStep({
  id: `handoffToSupport`,
  description: "Handoff classified message to support workflow.",
  stateSchema: globalStateSchema,
  inputSchema: classificationOutput,
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async (context) => {
    const { inputData, state, writer } = context;
    console.log("Executing handoffToSupport step...", inputData, state);
    writer.write({
      message: "Handoff to WorkspaceSensei initiated.",
    });

    const results = await supportWf.execute(context);
    console.log("Reading response:", results);

    return {
      message: results.details,
    };
  },
});
