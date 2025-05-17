/**
 * @see {@link file://./../../abi/Adminable.json} for the ABI implementation
 */
import type { Indexed } from "@src/types";

const adminableEvents: Indexed.Event[] = [
  {
    contractName: "Adminable",
    eventName: "TransferAdmin",
  },
];

export default adminableEvents;
