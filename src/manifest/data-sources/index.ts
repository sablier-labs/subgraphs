import type { Sablier } from "@sablier/deployments";
import type { Manifest } from "@src/types";
import { getFlowSources } from "./flow";
import { getLockupSources } from "./lockup";

export function getDataSources(protocol: Sablier.Protocol, chainId: number, chainName: string): Manifest.DataSource[] {
  switch (protocol) {
    case "flow": {
      return getFlowSources(chainId, chainName);
    }
    case "lockup": {
      return getLockupSources(chainId, chainName);
    }
    default:
      throw new Error(`Unknown protocol: ${protocol}`);
  }
}
