import type { Manifest } from "@src/graph-manifest/types";
import type { IndexedProtocol } from "@src/types";
import { logAndThrow } from "@src/winston";
import { createAirdropsSources } from "./airdrops";
import { createFlowSources } from "./flow";
import { createLockupSources } from "./lockup";

export function createSources(protocol: IndexedProtocol, chainId: number): Manifest.Source[] {
  switch (protocol) {
    case "airdrops": {
      return createAirdropsSources(chainId);
    }
    case "flow": {
      return createFlowSources(chainId);
    }
    case "lockup": {
      return createLockupSources(chainId);
    }
    default:
      logAndThrow(`Unsupported protocol: ${protocol}`);
  }
}
