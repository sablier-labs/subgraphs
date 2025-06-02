import type { GraphManifest } from "@src/graph-manifest/types";
import { getSources } from "./helpers";

export function getFlowSources(chainId: number): GraphManifest.Source[] {
  return getSources("flow", chainId);
}
