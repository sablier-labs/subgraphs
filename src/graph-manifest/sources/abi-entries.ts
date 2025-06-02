import indexedContracts from "@src/contracts";
import type { GraphManifest } from "@src/graph-manifest/types";
import paths, { getRelativePath } from "@src/paths";
import type { Indexed } from "@src/types";
import _ from "lodash";

function get(name: string): GraphManifest.ABI {
  return {
    name,
    get file() {
      return getFilePath(name);
    },
  };
}

export const erc20 = get("ERC20");
export const erc20Bytes = get("ERC20Bytes");
export const prbProxy = get("PRBProxy");
export const prbProxyRegistry = get("PRBProxyRegistry");

export function getABIEntries(protocol: Indexed.Protocol, contractName: string, version: Indexed.Version) {
  const contract = _.find(indexedContracts[protocol], (c) => c.name === contractName && c.versions.includes(version));
  if (!contract) {
    throw new Error(`Contract ${contractName} not found for ABI entries`);
  }

  const contractABIEntries: GraphManifest.ABI[] = [
    {
      name: contractName,
      file: getFilePath(contractName, protocol, version),
    },
  ];

  const otherABIEntries: GraphManifest.ABI[] = [erc20, erc20Bytes];
  if (protocol === "lockup") {
    otherABIEntries.push(prbProxy, prbProxyRegistry);
  }

  return [...contractABIEntries, ...otherABIEntries];
}

function getFilePath(contractName: string, protocol?: Indexed.Protocol, version?: Indexed.Version) {
  // It doesn't matter what protocol we use here, we just need the path to the manifests.
  const manifestsPath = paths.graph.manifests(protocol ?? "lockup");
  const abiPath = paths.abi(contractName, protocol, version);
  return getRelativePath(manifestsPath, abiPath);
}
