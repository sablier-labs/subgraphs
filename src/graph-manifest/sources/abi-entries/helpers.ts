import type { GraphManifest } from "@src/graph-manifest/types";
import paths, { getRelativePath } from "@src/paths";
import type { Indexed } from "@src/types";

export function createABIEntry(name: string) {
  return {
    name,
    get file() {
      return getFilePath(name);
    },
  };
}

export function createABIEntryForProtocol(protocol: Indexed.Protocol) {
  return function createABIEntry(version: Indexed.Version, contractName: string): GraphManifest.ABI {
    const entry: GraphManifest.ABI = {
      name: contractName,
      get file() {
        return getFilePath(contractName, protocol, version);
      },
    };

    return entry;
  };
}

function getFilePath(name: string, protocol?: Indexed.Protocol, version?: Indexed.Version) {
  // It doesn't matter what protocol we use here, we just need the path to the manifests.
  const MANIFESTS_PATH = paths.graph.manifests(protocol ?? "lockup");
  const abiPath = paths.abi(name, protocol, version);
  return getRelativePath(MANIFESTS_PATH, abiPath);
}
