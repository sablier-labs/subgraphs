import type { Config } from "@src/types";
import { createABIEntryFactory } from "./helpers";

// Create factory function for Flow ABI entries
const create = createABIEntryFactory("airdrops");

// Define the ABI entries using a simple constant object with proper typing
const airdropsEntries: Config.ABIEntries = {
  airdrops: {
    SablierV2MerkleStreamerFactory: {
      "v1.1": create("v1.1", "SablierV2MerkleStreamerFactory"),
    },
    SablierV2MerkleStreamerLL: {
      "v1.1": create("v1.1", "SablierV2MerkleStreamerLL"),
    },
    SablierV2MerkleLockupFactory: {
      "v1.2": create("v1.2", "SablierV2MerkleLockupFactory"),
    },
    SablierV2MerkleLL: {
      "v1.2": create("v1.2", "SablierV2MerkleLL"),
    },
    SablierV2MerkleLT: {
      "v1.2": create("v1.2", "SablierV2MerkleLT"),
    },
    SablierMerkleFactory: {
      "v1.3": create("v1.3", "SablierMerkleFactory"),
    },
    SablierMerkleInstant: {
      "v1.3": create("v1.3", "SablierMerkleInstant"),
    },
    SablierMerkleLL: {
      "v1.3": create("v1.3", "SablierMerkleLL"),
    },
    SablierMerkleLT: {
      "v1.3": create("v1.3", "SablierMerkleLT"),
    },
  },
} as const;

export default airdropsEntries;
