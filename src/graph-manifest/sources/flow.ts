import type { GraphManifest } from "@src/graph-manifest/types";
import { create } from "./helpers";

export function createFlowSources(chainId: number): GraphManifest.Source[] {
  return create("flow", chainId);
}
