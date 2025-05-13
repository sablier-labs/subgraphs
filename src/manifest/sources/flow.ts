import type { Sablier } from "@sablier/deployments";
import type { Config, Manifest } from "@src/types";
import { createSources } from "./creators";

const FLOW_CONTRACTS: Config.Contracts<Sablier.Version.Flow> = [
  {
    contractName: "SablierFlow",
    isTemplate: false,
    versions: ["v1.0", "v1.1"],
  },
];

export function getFlowSources(chainId: number, chainName: string): Manifest.Source[] {
  return createSources({
    contractMap: FLOW_CONTRACTS,
    protocol: "flow",
    chainId,
    chainName,
  });
}
