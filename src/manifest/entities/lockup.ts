import type { Config } from "../../types";

// Define common entity sets with clear naming
const baseEntities = ["Action", "Asset", "Contract", "Batch", "Batcher", "Stream", "Watcher"];

const dynamicEntities = ["Segment"];
const tranchedEntities = ["Tranche"];

// Define the entities using a simple constant object with proper typing
const lockupEntities: Config.Map.Entities = {
  lockup: {
    "v1.0": {
      SablierV2LockupDynamic: [...baseEntities, ...dynamicEntities],
      SablierV2LockupLinear: baseEntities,
    },
    "v1.1": {
      SablierV2LockupDynamic: [...baseEntities, ...dynamicEntities],
      SablierV2LockupLinear: baseEntities,
    },
    "v1.2": {
      SablierV2LockupDynamic: [...baseEntities, ...dynamicEntities],
      SablierV2LockupLinear: baseEntities,
      SablierV2LockupTranched: [...baseEntities, ...tranchedEntities],
    },
    "v2.0": {
      SablierLockup: [...baseEntities, ...dynamicEntities, ...tranchedEntities],
    },
  },
} as const;

export default lockupEntities;
