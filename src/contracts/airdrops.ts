import type { Sablier } from "@sablier/deployments";
import { Version } from "@sablier/deployments";
import type { Indexed } from "@src/types";

const airdropsContracts: Indexed.ContractSource<Sablier.Version.Airdrops>[] = [
  {
    isTemplate: false,
    name: "SablierV2MerkleStreamerFactory",
    versions: [Version.Airdrops.V1_1],
  },
  {
    isTemplate: true,
    name: "SablierV2MerkleStreamerLL",
    versions: [Version.Airdrops.V1_1],
  },
  {
    isTemplate: false,
    name: "SablierV2MerkleLockupFactory",
    versions: [Version.Airdrops.V1_2],
  },
  {
    isTemplate: true,
    name: "SablierV2MerkleLL",
    versions: [Version.Airdrops.V1_2],
  },
  {
    isTemplate: true,
    name: "SablierV2MerkleLT",
    versions: [Version.Airdrops.V1_2],
  },
  {
    isTemplate: false,
    name: "SablierMerkleFactory",
    versions: [Version.Airdrops.V1_3],
  },
  {
    isTemplate: true,
    name: "SablierMerkleInstant",
    versions: [Version.Airdrops.V1_3],
  },
  {
    isTemplate: true,
    name: "SablierMerkleLL",
    versions: [Version.Airdrops.V1_3],
  },
  {
    isTemplate: true,
    name: "SablierMerkleLT",
    versions: [Version.Airdrops.V1_3],
  },
];

export default airdropsContracts;
