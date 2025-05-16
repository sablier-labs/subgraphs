import type { EntitiesMap } from "@src/graph-manifest/types";

const baseEntities = ["Action", "Asset", "Batch", "Batcher", "Broker", "Contract", "Stream", "Watcher"];

const flowEntities: EntitiesMap = {
  SablierFlow: {
    "v1.0": baseEntities,
    "v1.1": baseEntities,
  },
} as const;

export default flowEntities;
