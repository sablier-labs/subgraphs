import type { Config } from "@src/types";
import { createABIEntryFactory } from "./helpers";

// Create factory function for Lockup ABI entries
const create = createABIEntryFactory("lockup");

// Define the ABI entries using a simple constant object with proper typing
const lockupEntries: Config.ABIEntries = {
  lockup: {
    SablierV2LockupDynamic: {
      "v1.0": create("v1.0", "SablierV2LockupDynamic"),
      "v1.1": create("v1.1", "SablierV2LockupDynamic"),
      "v1.2": create("v1.2", "SablierV2LockupDynamic"),
    },
    SablierV2LockupLinear: {
      "v1.0": create("v1.0", "SablierV2LockupLinear"),
      "v1.1": create("v1.1", "SablierV2LockupLinear"),
      "v1.2": create("v1.2", "SablierV2LockupLinear"),
    },
    SablierV2LockupTranched: {
      "v1.2": create("v1.2", "SablierV2LockupTranched"),
    },
    SablierLockup: {
      "v2.0": create("v2.0", "SablierLockup"),
    },
  },
} as const;

export default lockupEntries;
