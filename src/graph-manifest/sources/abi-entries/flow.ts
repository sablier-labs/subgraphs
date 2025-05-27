import { contracts } from "@sablier/deployments";
import type { ABIEntriesMap, GraphManifest } from "@src/graph-manifest/types";
import type { Indexed } from "@src/types";
import { erc20BytesEntry, erc20Entry } from "./common";
import { createABIEntryForProtocol } from "./helpers";

// Create factory function for Flow ABI entries
const createFor = createABIEntryForProtocol("flow");
function create(version: Indexed.Version, contractName: string): GraphManifest.ABI[] {
  const protocolEntry = createFor(version, contractName);
  const otherEntries = [erc20Entry, erc20BytesEntry];
  return [protocolEntry, ...otherEntries];
}

// Define the ABI entries using a simple constant object with proper typing
const flowEntries: ABIEntriesMap = {
  [contracts.names.SABLIER_FLOW]: {
    "v1.0": create("v1.0", contracts.names.SABLIER_FLOW),
    "v1.1": create("v1.1", contracts.names.SABLIER_FLOW),
  },
} as const;

export default flowEntries;
