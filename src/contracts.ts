import { type Sablier, Version } from "@sablier/deployments";
import type { IndexedContractList, IndexedProtocol } from "./types";

const airdrops: IndexedContractList<Sablier.Version.Airdrops> = [
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

const flow: IndexedContractList<Sablier.Version.Flow> = [
  {
    name: "SablierFlow",
    isTemplate: false,
    versions: [Version.Flow.V1_0, Version.Flow.V1_1],
  },
];

const lockup: IndexedContractList<Sablier.Version.Lockup> = [
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

const indexedContracts: Record<IndexedProtocol, IndexedContractList<Sablier.Version>> = {
  airdrops,
  flow,
  lockup,
};

export default indexedContracts;
