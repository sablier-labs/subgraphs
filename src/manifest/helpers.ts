/** @internal */
import fs from "node:fs";
import path from "node:path";
import type { Manifest } from "../types";
import logger from "../winston";

/**
 * Resolves the relative path to a file in the manifests directory.
 *
 * @internal
 * @param protocol - The protocol to resolve the path for: `airdrops,`flow`, or `lockup`.
 * @param filePath - The path to the file to resolve, relative to the root of each protocol's directory.
 * @returns The relative path to the file
 *
 * @example
 * ```typescript
 * const path = resolvePath("flow", "SablierFlow");
 * // path is now "../../../../abi/SablierFlow.json"
 * ```
 */
export function resolveABIPath(protocol: string, contractName: string): string {
  const MANIFESTS_PATH = path.resolve(__dirname, `../graph/${protocol}/manifests`);
  const ABI_PATH = path.resolve(__dirname, `../abi/${contractName}.json`);
  return path.relative(MANIFESTS_PATH, ABI_PATH);
}

/**
 * Resolves an event handler for a specific contract event.
 *
 * This function:
 * 1. Reads the contract ABI from the file system
 * 2. Finds the specified event in the ABI
 * 3. Constructs an event signature with indexed parameters
 * 4. Returns an object with the event signature and handler function name
 *
 * @internal
 * @param contractName - The name of the contract (used to locate the ABI file)
 * @param eventName - The name of the event to create a handler for
 * @returns A Manifest.EventHandler object with event signature and handler name
 *
 * @example
 * Using `Adminable.json` as an example and the event name `TransferAdmin`, the following should be returned:
 *
 * ```
 * {
 *   event: "TransferAdmin(indexed address,indexed address)",
 *   handler: "handleTransferAdmin"
 * }
 * ```
 */
export function resolveEventHandler(contractName: string, eventName: string): Manifest.EventHandler {
  const abiPath = path.resolve(__dirname, `../abi/${contractName}.json`);

  try {
    const abiContent = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

    const event = abiContent.find(
      (item: { type: string; name: string }) => item.type === "event" && item.name === eventName,
    );

    if (!event) {
      const errorMsg = `Event ${eventName} not found in ABI for contract ${contractName}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    if (!event.inputs) {
      const errorMsg = `Event ${eventName} has no inputs in ABI for contract ${contractName}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const inputs = event.inputs
      .map((input: { indexed?: boolean; type: string }) => {
        return input.indexed ? `indexed ${input.type}` : input.type;
      })
      .join(",");

    return {
      event: `${eventName}(${inputs})`,
      handler: `handle${eventName}`,
    };
  } catch (error) {
    logger.error(`Error processing ABI for contract ${contractName} and event ${eventName}: ${error}`);
    throw error;
  }
}
