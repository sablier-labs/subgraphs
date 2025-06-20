import * as fs from "fs-extra";
import _ from "lodash";
import { sanitizeContractName } from "../../helpers";
import paths from "../../paths";
import type { Types } from "../../types";
import { logger } from "../../winston";
import type { GraphManifest } from "./manifest-types";

/**
 * Resolves an event handler for The Graph manifest.
 * @param event The event object; @see Types.Event
 * @returns A GraphManifest.EventHandler object
 * @example SablierLockup_v2_0_Approval
 * @example SablierLockup_v2_0_CreateLockupLinearStream
 */
export function resolveEventHandler(event: Types.Event): GraphManifest.EventHandler {
  const { contractName, eventName, protocol, version } = event;
  const abiPath = paths.abi(contractName, protocol, version);

  try {
    const sanitizedContractName = sanitizeContractName(contractName, version);
    const abiContent: AbiItem[] = JSON.parse(fs.readFileSync(abiPath, "utf-8"));
    const foundEvent = findEventInAbi(abiContent, eventName, contractName);
    const eventSignature = buildEventSignature(foundEvent, eventName);

    return {
      event: eventSignature,
      handler: `handle_${sanitizedContractName}_${eventName}`,
    };
  } catch (error) {
    logger.error(`Error processing ABI for contract ${contractName} and event ${eventName}: ${error}`);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*                                COMMON LOGIC                                */
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
 * @example CreateLockupLinearStream(uint256,address,indexed address,indexed address,(uint128,uint128,uint128),indexed address,bool,bool,(uint40,uint40,uint40),address)
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
  const event = _.find(abiContent, { name: eventName, type: "event" });

  if (!event) {
    throw new Error(`Event ${eventName} not found in ABI for contract ${contractName}`);
  }

  if (!event.inputs) {
    throw new Error(`Event ${eventName} has no inputs in ABI for contract ${contractName}`);
  }

  return event;
}
