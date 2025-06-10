import type { Sablier } from "@sablier/deployments";

export function formatRelease(release: Sablier.Release) {
  return `${release.protocol} ${release.version}`;
}
