import type { GraphManifest } from "@src/graph-manifest/types";
import type { Indexed } from "@src/types";
import { createAirdropsSources } from "./airdrops";
import { createFlowSources } from "./flow";
import { createLockupSources } from "./lockup";

export function createSources(protocol: Indexed.Protocol, chainId: number): GraphManifest.Source[] {
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
  }
}
