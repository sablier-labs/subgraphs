import type { Manifest } from "../../types";
import { resolveEventHandler as resolve } from "../helpers";
/**
 * Adminable event handlers configuration.
 * @see {@link ../../abi/Adminable.json} for the ABI implementation
 * @see https://github.com/sablier-labs/evm-utils/blob/64835cd/src/Adminable.sol
 */
const adminableEventHandlers: Manifest.EventHandler[] = [resolve("Adminable", "TransferAdmin")];

export default adminableEventHandlers;
