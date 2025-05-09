import type { Config } from "../../types";
import { createABIEntryFactory } from "../helpers";

// Create factory function for Lockup ABI entries
const create = createABIEntryFactory("lockup");

// Define the ABI entries using a simple constant object with proper typing
const lockupEntries: Config.Map.ABIEntries = {
  lockup: {
    "v1.0": {
      ...create("v1.0", "SablierV2LockupDynamic"),
      ...create("v1.0", "SablierV2LockupLinear"),
    },
    "v1.1": {
      ...create("v1.1", "SablierV2LockupDynamic"),
      ...create("v1.1", "SablierV2LockupLinear"),
    },
    "v1.2": {
      ...create("v1.2", "SablierV2LockupDynamic"),
      ...create("v1.2", "SablierV2LockupLinear"),
      ...create("v1.2", "SablierV2LockupTranched"),
    },
    "v2.0": {
      ...create("v2.0", "SablierLockup"),
    },
  },
} as const;

export default lockupEntries;
