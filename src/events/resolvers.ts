import type { Manifest } from "@src/graph-manifest/types";
import { paths } from "@src/paths";
import type { Indexed } from "@src/types";
import logger, { logAndThrow } from "@src/winston";
import * as fs from "fs-extra";

/**
 * Resolves an event handler for The Graph manifest.
 * @param event The event object; @see Indexed.Event
 * @returns A Manifest.EventHandler object
 */
export function resolveEventHandler(event: Indexed.Event): Manifest.EventHandler {
  const { contractName, eventName, handlerSuffix, protocol, version } = event;
  const abiPath = paths.abi(contractName, protocol, version);

  try {
    const abiContent: AbiItem[] = JSON.parse(fs.readFileSync(abiPath, "utf-8"));
    const foundEvent = findEventInAbi(abiContent, eventName, contractName);
    const eventSignature = buildEventSignature(foundEvent, eventName);

    return {
      event: eventSignature,
      handler: `handle${eventName}${handlerSuffix || ""}`,
    };
  } catch (error) {
    logger.error(`Error processing ABI for contract ${contractName} and event ${eventName}: ${error}`);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*                                  INTERNAL                                  */
/* -------------------------------------------------------------------------- */

type AbiInput = {
  indexed?: boolean;
  type: string;
  components?: AbiInput[];
};

type AbiItem = {
  type: string;
  name: string;
  inputs?: AbiInput[];
};

/**
 * Builds the event signature string from the event definition. Note that this will not include parameter names.
 * @example Approval(indexed address,indexed address,uint256)
 */
function buildEventSignature(event: AbiItem, name: string): string {
  if (!event.inputs || event.inputs.length === 0) {
    return `${name}()`;
  }

  const inputs = event.inputs
    .map((input: AbiInput) => {
      let typeStr: string;

      // Handle tuple types (tuple and tuple[]) by unpacking their component types
      if (input.components && input.type.startsWith("tuple")) {
        typeStr = processComponentsType(input);
      } else {
        typeStr = input.type;
      }

      return input.indexed ? `indexed ${typeStr}` : typeStr;
    })
    .join(",");

  return `${name}(${inputs})`;
}

/**
 * Recursively processes tuple components to handle nested tuples
 */
function processComponentsType(input: AbiInput): string {
  if (!input.components) {
    return input.type;
  }

  const componentsTypes = input.components
    .map((comp) => {
      if (comp.type === "tuple" && comp.components) {
        return processComponentsType(comp as AbiInput);
      }
      return comp.type;
    })
    .join(",");

  const tupleStr = `(${componentsTypes})`;
  const arrayNotation = input.type.includes("[]") ? "[]" : "";
  return `${tupleStr}${arrayNotation}`;
}

/**
 * Finds an event in the ABI by name
 */
function findEventInAbi(abiContent: AbiItem[], eventName: string, contractName: string): AbiItem {
  const event = abiContent.find((item) => item.type === "event" && item.name === eventName);

  if (!event) {
    logAndThrow(`Event ${eventName} not found in ABI for ${contractName}`);
  }

  if (!event.inputs) {
    logAndThrow(`Event ${eventName} has no inputs in ABI for ${contractName}`);
  }

  return event;
}
