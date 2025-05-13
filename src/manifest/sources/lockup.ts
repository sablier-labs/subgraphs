import type { Sablier } from "@sablier/deployments";
import type { Config, Manifest } from "@src/types";
import { createSources } from "./creators";

const LOCKUP_CONTRACTS: Config.Contracts<Sablier.Version.Lockup> = [
  {
    contractName: "SablierV2LockupDynamic",
    isTemplate: false,
    versions: ["v1.0", "v1.1", "v1.2"],
  },
  {
    contractName: "SablierV2LockupLinear",
    isTemplate: false,
    versions: ["v1.0", "v1.1", "v1.2"],
  },
  {
    contractName: "SablierV2LockupTranched",
    isTemplate: false,
    versions: ["v1.2"],
  },
  {
    contractName: "SablierLockup",
    isTemplate: false,
    versions: ["v2.0"],
  },
];

export function getLockupSources(chainId: number, chainName: string): Manifest.Source[] {
  return createSources({
    contractMap: LOCKUP_CONTRACTS,
    protocol: "lockup",
    chainId,
    chainName,
  });
}
