import type { Sablier } from "@sablier/deployments";
import { Version } from "@sablier/deployments";
import type { Indexed } from "./types";

const airdrops: Indexed.ContractSource<Sablier.Version.Airdrops>[] = [
  {
    name: "SablierV2MerkleStreamerFactory",
    isTemplate: false,
    versions: [Version.Airdrops.V1_1],
  },
  {
    name: "SablierV2MerkleStreamerLL",
    isTemplate: true,
    versions: [Version.Airdrops.V1_1],
  },
  {
    name: "SablierV2MerkleLockupFactory",
    isTemplate: false,
    versions: [Version.Airdrops.V1_2],
  },
  {
    name: "SablierV2MerkleLL",
    isTemplate: true,
    versions: [Version.Airdrops.V1_2],
  },
  {
    name: "SablierV2MerkleLT",
    isTemplate: true,
    versions: [Version.Airdrops.V1_2],
  },
  {
    name: "SablierMerkleFactory",
    isTemplate: false,
    versions: [Version.Airdrops.V1_3],
  },
  {
    name: "SablierMerkleInstant",
    isTemplate: true,
    versions: [Version.Airdrops.V1_3],
  },
  {
    name: "SablierMerkleLL",
    isTemplate: true,
    versions: [Version.Airdrops.V1_3],
  },
  {
    name: "SablierMerkleLT",
    isTemplate: true,
    versions: [Version.Airdrops.V1_3],
  },
];

const flow: Indexed.ContractSource<Sablier.Version.Flow>[] = [
  {
    name: "SablierFlow",
    isTemplate: false,
    versions: [Version.Flow.V1_0, Version.Flow.V1_1],
  },
];

const lockup: Indexed.ContractSource<Sablier.Version.Lockup>[] = [
  {
    name: "SablierV2LockupDynamic",
    isTemplate: false,
    versions: [Version.Lockup.V1_0, Version.Lockup.V1_1, Version.Lockup.V1_2],
  },
  {
    name: "SablierV2LockupLinear",
    isTemplate: false,
    versions: [Version.Lockup.V1_0, Version.Lockup.V1_1, Version.Lockup.V1_2],
  },
  {
    name: "SablierV2LockupTranched",
    isTemplate: false,
    versions: [Version.Lockup.V1_2],
  },
  {
    name: "SablierLockup",
    isTemplate: false,
    versions: [Version.Lockup.V2_0],
  },
];

const indexedContracts: Record<Indexed.Protocol, Indexed.ContractSource<Indexed.Version>[]> = {
  airdrops,
  flow,
  lockup,
};

export function getIndexedContract(contract: Sablier.Contract): Indexed.Contract {
  return {
    address: contract.address.toLowerCase(),
    alias: contract.alias ?? "",
    block: contract.block ?? 0,
    name: contract.name,
    protocol: contract.protocol as Indexed.Protocol,
    version: contract.version as Indexed.Version,
  };
}

export default indexedContracts;
