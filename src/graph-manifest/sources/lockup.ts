import type { GraphManifest } from "@src/graph-manifest/types";
import { create } from "./helpers";

export function createLockupSources(chainId: number): GraphManifest.Source[] {
  return create("lockup", chainId);
}
