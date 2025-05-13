import type { Sablier } from "@sablier/deployments";
import type { Manifest } from "@src/types";
import logger from "@src/winston";
import { getAirdropsSources } from "./airdrops";
import { getFlowSources } from "./flow";
import { getLockupSources } from "./lockup";

export function getSources(protocol: Sablier.Protocol, chainId: number, chainName: string): Manifest.Source[] {
  switch (protocol) {
    case "airdrops": {
      return getAirdropsSources(chainId, chainName);
    }
    case "flow": {
      return getFlowSources(chainId, chainName);
    }
    case "lockup": {
      return getLockupSources(chainId, chainName);
    }
    default:
      logger.error(`Unsupported protocol: ${protocol}`);
      process.exit(1);
  }
}
