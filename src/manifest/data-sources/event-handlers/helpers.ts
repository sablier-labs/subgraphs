import fs from "node:fs";
import type { Sablier } from "@sablier/deployments";
import { getAbiPath } from "@src/paths";
import type { Manifest } from "@src/types";
import logger from "@src/winston";

/**
 * Resolves an event handler for a specific contract event
 * @param params Object containing event handler parameters
 * @param params.protocol The Sablier protocol (e.g. flow, lockup)
 * @param params.version The version of the protocol for protocol-specific contracts
 * @param params.contractName The name of the contract
 * @param params.eventName The name of the event
 * @returns A Manifest.EventHandler object
 */
export function resolveEventHandler(params: {
  protocol?: Sablier.Protocol;
  version?: Sablier.Version;
  contractName: string;
  eventName: string;
}): Manifest.EventHandler {
  const { protocol, version, contractName, eventName } = params;
  const abiPath = getAbiPath(contractName, protocol, version);

  try {
    const abiContent: AbiItem[] = JSON.parse(fs.readFileSync(abiPath, "utf-8"));
    const event = findEventInAbi(abiContent, eventName, contractName);
    const eventSignature = buildEventSignature(event, eventName);

    return {
      event: eventSignature,
      handler: `handle${eventName}`,
    };
  } catch (error) {
    logger.error(`Error processing ABI for contract ${contractName} and event ${eventName}: ${error}`);
    throw error;
  }
}

/*//////////////////////////////////////////////////////////////////////////
                                  INTERNAL
//////////////////////////////////////////////////////////////////////////*/

interface AbiInput {
  indexed?: boolean;
  type: string;
  components?: AbiInput[];
}

interface AbiItem {
  type: string;
  name: string;
  inputs?: AbiInput[];
}

/**
 * Builds the event signature string from the event definition
 */
function buildEventSignature(event: AbiItem, eventName: string): string {
  if (!event.inputs || event.inputs.length === 0) {
    return `${eventName}()`;
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

  return `${eventName}(${inputs})`;
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
    const errorMsg = `Event ${eventName} not found in ABI for ${contractName}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!event.inputs) {
    const errorMsg = `Event ${eventName} has no inputs in ABI for ${contractName}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  return event;
}
