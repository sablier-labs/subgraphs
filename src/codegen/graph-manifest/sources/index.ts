import type { Types } from "../../../types";
import type { GraphManifest } from "../manifest-types";
import { getAirdropsSources } from "./airdrops";
import { getFlowSources } from "./flow";
import { getLockupSources } from "./lockup";

export function createSources(protocol: Types.Protocol, chainId: number): GraphManifest.Source[] {
  switch (protocol) {
    case "airdrops": {
      return getAirdropsSources(chainId);
    }
    case "flow": {
      return getFlowSources(chainId);
    }
    case "lockup": {
      return getLockupSources(chainId);
    }
  }
}
