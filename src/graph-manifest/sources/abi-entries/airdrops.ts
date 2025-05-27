import { contracts } from "@sablier/deployments";
import type { ABIEntriesMap, GraphManifest } from "@src/graph-manifest/types";
import type { Indexed } from "@src/types";
import { erc20BytesEntry, erc20Entry } from "./common";
import { createABIEntryForProtocol } from "./helpers";

const { names } = contracts;

function create(version: Indexed.Version, contractName: string): GraphManifest.ABI[] {
  const protocolEntry = createABIEntryForProtocol("airdrops")(version, contractName);
  const otherEntries = [erc20Entry, erc20BytesEntry];
  return [protocolEntry, ...otherEntries];
}

// Define the ABI entries using a simple constant object with proper typing
const airdropsEntries: ABIEntriesMap = {
  [names.SABLIER_V2_MERKLE_STREAMER_FACTORY]: {
    "v1.1": create("v1.1", names.SABLIER_V2_MERKLE_STREAMER_FACTORY),
  },
  [names.SABLIER_V2_MERKLE_STREAMER_LL]: {
    "v1.1": create("v1.1", names.SABLIER_V2_MERKLE_STREAMER_LL),
  },
  [names.SABLIER_V2_MERKLE_LOCKUP_FACTORY]: {
    "v1.2": create("v1.2", names.SABLIER_V2_MERKLE_LOCKUP_FACTORY),
  },
  [names.SABLIER_V2_MERKLE_LL]: {
    "v1.2": create("v1.2", names.SABLIER_V2_MERKLE_LL),
  },
  [names.SABLIER_V2_MERKLE_LT]: {
    "v1.2": create("v1.2", names.SABLIER_V2_MERKLE_LT),
  },
  [names.SABLIER_MERKLE_FACTORY]: {
    "v1.3": create("v1.3", names.SABLIER_MERKLE_FACTORY),
  },
  [names.SABLIER_MERKLE_INSTANT]: {
    "v1.3": create("v1.3", names.SABLIER_MERKLE_INSTANT),
  },
  [names.SABLIER_MERKLE_LL]: {
    "v1.3": create("v1.3", names.SABLIER_MERKLE_LL),
  },
  [names.SABLIER_MERKLE_LT]: {
    "v1.3": create("v1.3", names.SABLIER_MERKLE_LT),
  },
} as const;

export default airdropsEntries;
