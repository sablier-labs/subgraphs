import { contracts } from "@sablier/deployments";
import type { ABIEntriesMap, GraphManifest } from "@src/graph-manifest/types";
import type { Indexed } from "@src/types";
import { erc20BytesEntry, erc20Entry, prbProxyEntry, prbProxyRegistryEntry } from "./common";
import { createABIEntryForProtocol } from "./helpers";

const { names } = contracts;

function create(version: Indexed.Version, contractName: string): GraphManifest.ABI[] {
  const protocolEntry = createABIEntryForProtocol("lockup")(version, contractName);
  const otherEntries = [erc20Entry, erc20BytesEntry, prbProxyEntry, prbProxyRegistryEntry];
  return [protocolEntry, ...otherEntries];
}

// Define the ABI entries using a simple constant object with proper typing
const lockupEntries: ABIEntriesMap = {
  [names.SABLIER_V2_LOCKUP_DYNAMIC]: {
    "v1.0": create("v1.0", names.SABLIER_V2_LOCKUP_DYNAMIC),
    "v1.1": create("v1.1", names.SABLIER_V2_LOCKUP_DYNAMIC),
    "v1.2": create("v1.2", names.SABLIER_V2_LOCKUP_DYNAMIC),
  },
  [names.SABLIER_V2_LOCKUP_LINEAR]: {
    "v1.0": create("v1.0", names.SABLIER_V2_LOCKUP_LINEAR),
    "v1.1": create("v1.1", names.SABLIER_V2_LOCKUP_LINEAR),
    "v1.2": create("v1.2", names.SABLIER_V2_LOCKUP_LINEAR),
  },
  [names.SABLIER_V2_LOCKUP_TRANCHED]: {
    "v1.2": create("v1.2", names.SABLIER_V2_LOCKUP_TRANCHED),
  },
  [names.SABLIER_LOCKUP]: {
    "v2.0": create("v2.0", names.SABLIER_LOCKUP),
  },
} as const;

export default lockupEntries;
