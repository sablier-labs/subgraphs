import type { Manifest } from "@src/graph-manifest/types";
import { create } from "./helpers";

export function createFlowSources(chainId: number): Manifest.Source[] {
  return create("flow", chainId);
}
