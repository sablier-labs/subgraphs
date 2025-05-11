import type { Sablier } from "@sablier/deployments";
import type { Config, Manifest } from "@src/types";
import { createSources } from "./helpers";

const FLOW_CONTRACTS: Config.ContractList<Sablier.Version.Flow> = [
  {
    contractName: "SablierFlow",
    versions: ["v1.0", "v1.1"],
  },
];

export function getFlowSources(chainId: number, chainName: string): Manifest.DataSource[] {
  return createSources(FLOW_CONTRACTS, "flow", chainId, chainName);
}
