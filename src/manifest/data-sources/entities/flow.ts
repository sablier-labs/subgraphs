import type { Config } from "@src/types";

const baseEntities = ["Action", "Asset", "Batch", "Batcher", "Broker", "Contract", "Stream", "Watcher"];

const flowEntities: Config.Map.Entities = {
  flow: {
    SablierFlow: {
      "v1.0": baseEntities,
      "v1.1": baseEntities,
    },
  },
} as const;

export default flowEntities;
