import type { Sablier } from "@sablier/deployments";
import { contracts, Version } from "@sablier/deployments";
import type { Indexed } from "@src/types";

const airdropsContracts: Indexed.ContractSource<Sablier.Version.Airdrops>[] = [
  {
    isTemplate: false,
    name: contracts.names.SABLIER_V2_MERKLE_STREAMER_FACTORY,
    versions: [Version.Airdrops.V1_1],
  },
  {
    isTemplate: true,
    name: contracts.names.SABLIER_V2_MERKLE_STREAMER_LL,
    versions: [Version.Airdrops.V1_1],
  },
  {
    isTemplate: false,
    name: contracts.names.SABLIER_V2_MERKLE_LOCKUP_FACTORY,
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
    name: contracts.names.SABLIER_MERKLE_FACTORY,
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
