import path from "node:path";
import type { Sablier } from "@sablier/deployments";

export const SRC_DIR = path.resolve(__dirname);
export const ABI_DIR = path.join(SRC_DIR, "abi");
export const GRAPH_DIR = path.join(SRC_DIR, "graph");
export const SCHEMA_DIR = path.join(SRC_DIR, "schema");

export function getAbiPath(contractName: string, protocol?: Sablier.Protocol, version?: Sablier.Version): string {
  if (protocol && version) {
    return path.join(ABI_DIR, `${protocol}-${version}`, `${contractName}.json`);
  }
  return path.join(ABI_DIR, `${contractName}.json`);
}

export function getGraphManifestPath(protocol: string): string {
  return path.join(GRAPH_DIR, protocol, "manifests");
}

export function getRelativePath(from: string, to: string): string {
  return path.relative(from, to);
}
