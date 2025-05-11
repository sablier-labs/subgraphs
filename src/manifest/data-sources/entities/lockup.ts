import type { Config } from "@src/types";

// Define common entity sets with clear naming
const baseEntities = ["Action", "Asset", "Contract", "Batch", "Batcher", "Stream", "Watcher"];

const dynamicEntities = [...baseEntities, "Segment"];
const tranchedEntities = [...baseEntities, "Tranche"];

// Define the entities using a simple constant object with proper typing
const lockupEntities: Config.Map.Entities = {
  lockup: {
    SablierV2LockupDynamic: {
      "v1.0": dynamicEntities,
      "v1.1": dynamicEntities,
      "v1.2": dynamicEntities,
    },
    SablierV2LockupLinear: {
      "v1.0": baseEntities,
      "v1.1": baseEntities,
      "v1.2": baseEntities,
    },
    SablierV2LockupTranched: {
      "v1.2": tranchedEntities,
    },
    SablierLockup: {
      "v2.0": [...baseEntities, ...dynamicEntities, ...tranchedEntities],
    },
  },
} as const;

export default lockupEntities;
