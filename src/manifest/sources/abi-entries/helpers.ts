import type { Sablier } from "@sablier/deployments";
import { getAbiPath, getGraphManifestPath, getRelativePath } from "@src/paths";
import type { Manifest } from "@src/types";

/** Creates a factory function for generating ABI entries. */
export function createABIEntryFactory(protocol: Sablier.Protocol) {
  /**
   * Creates an ABI entry for a specific version and contract
   * @param version The version of the protocol
   * @param contractName The name of the contract
   * @returns An object with contract name as key and ABI array as value
   */
  return function createABIEntry(version: Sablier.Version, contractName: string): Manifest.ABI[] {
    const entry: Manifest.ABI = {
      name: contractName,
      get file() {
        const graphManifest = getGraphManifestPath(protocol);
        const abi = getAbiPath(contractName, protocol, version);
        return getRelativePath(graphManifest, abi);
      },
    };

    return [entry];
  };
}
