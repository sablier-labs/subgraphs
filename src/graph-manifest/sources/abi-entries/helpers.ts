import type { Manifest } from "@src/graph-manifest/types";
import { getRelativePath, paths } from "@src/paths";
import type { Indexed } from "@src/types";

/** Creates a factory function for generating ABI entries. */
export function createABIEntryFactory(protocol: Indexed.Protocol) {
  /**
   * Creates an ABI entry for a specific version and contract
   * @param version The version of the protocol
   * @param contractName The name of the contract
   * @returns An object with contract name as key and ABI array as value
   */
  return function createABIEntry(version: Indexed.Version, contractName: string): Manifest.ABI[] {
    const entry: Manifest.ABI = {
      name: contractName,
      get file() {
        const manifestsPath = paths.graphManifests(protocol);
        const abiPath = paths.abi(contractName, protocol, version);
        return getRelativePath(manifestsPath, abiPath);
      },
    };

    return [entry];
  };
}
