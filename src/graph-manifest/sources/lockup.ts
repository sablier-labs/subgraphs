import type { GraphManifest } from "@src/graph-manifest/types";
import { getSources } from "./helpers";

export function getLockupSources(chainId: number): GraphManifest.Source[] {
  return getSources("lockup", chainId);
}
