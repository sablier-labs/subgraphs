import type { Sablier } from "@sablier/deployments";
import type { Config, Manifest } from "../../types";
import { createSources } from "./helpers";

const LOCKUP_CONTRACTS: Config.ContractList<Sablier.Version.Lockup> = [
  {
    contractName: "SablierV2LockupDynamic",
    versions: ["v1.0", "v1.1", "v1.2"],
  },
  {
    contractName: "SablierV2LockupLinear",
    versions: ["v1.0", "v1.1", "v1.2"],
  },
  {
    contractName: "SablierV2LockupTranched",
    versions: ["v1.2"],
  },
  {
    contractName: "SablierLockup",
    versions: ["v2.0"],
  },
];

export function getLockupSources(chainId: number, chainName: string): Manifest.DataSource[] {
  return createSources(LOCKUP_CONTRACTS, "lockup", chainId, chainName);
}
