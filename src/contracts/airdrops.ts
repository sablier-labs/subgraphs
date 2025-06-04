import type { Sablier } from "@sablier/deployments";
import { contracts, Version } from "@sablier/deployments";
import type { Indexed } from "../types";

const { names } = contracts;

const airdropsContracts: Indexed.ContractSource<Sablier.Version.Airdrops>[] = [
  {
    isTemplate: false,
    name: names.SABLIER_V2_MERKLE_STREAMER_FACTORY,
    versions: [Version.Airdrops.V1_1],
  },
  {
    isTemplate: true,
    name: names.SABLIER_V2_MERKLE_STREAMER_LL,
    versions: [Version.Airdrops.V1_1],
  },
  {
    isTemplate: false,
    name: names.SABLIER_V2_MERKLE_LOCKUP_FACTORY,
    versions: [Version.Airdrops.V1_2],
  },
  {
    isTemplate: true,
    name: names.SABLIER_V2_MERKLE_LL,
    versions: [Version.Airdrops.V1_2],
  },
  {
    isTemplate: true,
    name: names.SABLIER_V2_MERKLE_LT,
    versions: [Version.Airdrops.V1_2],
  },
  {
    isTemplate: false,
    name: names.SABLIER_MERKLE_FACTORY,
    versions: [Version.Airdrops.V1_3],
  },
  {
    isTemplate: true,
    name: names.SABLIER_MERKLE_INSTANT,
    versions: [Version.Airdrops.V1_3],
  },
  {
    isTemplate: true,
    name: names.SABLIER_MERKLE_LL,
    versions: [Version.Airdrops.V1_3],
  },
  {
    isTemplate: true,
    name: names.SABLIER_MERKLE_LT,
    versions: [Version.Airdrops.V1_3],
  },
];

export default airdropsContracts;
