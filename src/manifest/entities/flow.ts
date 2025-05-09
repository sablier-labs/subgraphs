import type { Config } from "../../types";
const commonEntities = ["Action", "Asset", "Batch", "Batcher", "Broker", "Contract", "Stream", "Watcher"];

const flowEntities: Config.Map.Entities = {
  flow: {
    "v1.0": {
      SablierFlow: commonEntities,
    },
    "v1.1": {
      SablierFlow: commonEntities,
    },
  },
} as const;

export default flowEntities;
