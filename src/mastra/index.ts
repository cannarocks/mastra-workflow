import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { webAgent } from "./agents/web-agent";
import { workflow } from "./workflows/e2e-workflow";
import path from "path";

export const mastra = new Mastra({
  storage: new LibSQLStore({
    url: `file:${path.resolve(__dirname, "../../.storage/storage.db")}`,
  }),
  // agents: { webAgent },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  observability: {
    default: {
      enabled: true,
    },
  },
  workflows: { workflow },
});
