import type { Manifest } from "@src/graph-manifest/types";
import { create } from "./helpers";

export function createLockupSources(chainId: number): Manifest.Source[] {
  return create("lockup", chainId);
}
