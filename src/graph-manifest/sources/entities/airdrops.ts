import type { EntitiesMap } from "@src/graph-manifest/types";

const baseEntities = ["Action", "Activity", "Asset", "Campaign", "Watcher"];
const factoryEntities = [...baseEntities, "Factory"];

const airdropsEntities: EntitiesMap = {
  SablierV2MerkleStreamerFactory: {
    "v1.1": factoryEntities,
  },
  SablierV2MerkleStreamerLL: {
    "v1.1": baseEntities,
  },
  SablierV2MerkleLockupFactory: {
    "v1.2": factoryEntities,
  },
  SablierV2MerkleLL: {
    "v1.2": baseEntities,
  },
  SablierV2MerkleLT: {
    "v1.2": baseEntities,
  },
  SablierMerkleFactory: {
    "v1.3": factoryEntities,
  },
  SablierMerkleInstant: {
    "v1.3": baseEntities,
  },
  SablierMerkleLL: {
    "v1.3": baseEntities,
  },
  SablierMerkleLT: {
    "v1.3": baseEntities,
  },
} as const;

export default airdropsEntities;
