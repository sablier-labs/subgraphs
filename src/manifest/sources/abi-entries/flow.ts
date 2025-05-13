import type { Config } from "@src/types";
import { createABIEntryFactory } from "./helpers";

// Create factory function for Flow ABI entries
const create = createABIEntryFactory("flow");

// Define the ABI entries using a simple constant object with proper typing
const flowEntries: Config.ABIEntries = {
  flow: {
    SablierFlow: {
      "v1.0": create("v1.0", "SablierFlow"),
      "v1.1": create("v1.1", "SablierFlow"),
    },
  },
} as const;

export default flowEntries;
