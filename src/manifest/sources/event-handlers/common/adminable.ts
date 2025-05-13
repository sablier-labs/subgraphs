/**
 * @see {@link file://./../../../../abi/Adminable.json} for the ABI implementation
 */
import type { Manifest } from "@src/types";
import { resolveEventHandler as resolve } from "../resolver";

const adminableHandlers: Manifest.EventHandler[] = [
  resolve({
    contractName: "Adminable",
    eventName: "TransferAdmin",
  }),
];

export default adminableHandlers;
