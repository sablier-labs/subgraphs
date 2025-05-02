import { Address } from "@graphprotocol/graph-ts";
import { getLockupContracts } from "../../../../deprecated/contracts";
import { getChainId } from "../../getters";

import {
  EventCreateDynamic_V20,
  EventCreateDynamic_V21,
  EventCreateDynamic_V22,
  EventCreateDynamic_V23,
  EventCreateLinear_V20,
  EventCreateLinear_V21,
  EventCreateLinear_V22,
  EventCreateLinear_V23,
  EventCreateTranched_V22,
  EventCreateTranched_V23,
  EventTransferAdmin,
  TemplateLockupDynamic,
  TemplateLockupLinear,
  TemplateLockupMerged,
  TemplateLockupTranched,
} from "../bindings";

import { getOrCreateWatcher } from "../schema";
import { createContract } from "../schema";

/**
 * Use the oldest contract as a trigger to start indexing all the other contracts.
 */

export function handleInitializer(): void {
  const watcher = getOrCreateWatcher();
  if (watcher.initialized) {
    return;
  }

  watcher.initialized = true;
  watcher.save();

  const chainId = getChainId().toI64();
  const contracts = getLockupContracts(chainId);
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const address = Address.fromString(contract.address);
    switch (contract.name) {
      case "SablierV2LockupLinear":
        TemplateLockupLinear.create(address);
        createContract(address, contract.alias, contract.version, "LockupLinear");
        break;
      case "SablierV2LockupDynamic":
        TemplateLockupDynamic.create(address);
        createContract(address, contract.alias, contract.version, "LockupDynamic");
        break;
      case "SablierV2LockupTranched":
        TemplateLockupTranched.create(address);
        createContract(address, contract.alias, contract.version, "LockupTranched");
        break;
      case "SablierLockup":
        TemplateLockupMerged.create(address);
        createContract(address, contract.alias, contract.version, "LockupMerged");
        break;
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                Genesis                                     */
/* -------------------------------------------------------------------------- */
export function handleInitializer_Admin(_event: EventTransferAdmin): void {
  handleInitializer();
}

/* -------------------------------------------------------------------------- */
/*                                LockupLinear                                */
/* -------------------------------------------------------------------------- */
export function handleInitializer_CreateLinear_V20(_event: EventCreateLinear_V20): void {
  handleInitializer();
}
export function handleInitializer_CreateLinear_V21(_event: EventCreateLinear_V21): void {
  handleInitializer();
}

export function handleInitializer_CreateLinear_V22(_event: EventCreateLinear_V22): void {
  handleInitializer();
}

export function handleInitializer_CreateLinear_V23(_event: EventCreateLinear_V23): void {
  handleInitializer();
}

/* -------------------------------------------------------------------------- */
/*                                LockupDynamic                               */
/* -------------------------------------------------------------------------- */
export function handleInitializer_CreateDynamic_V20(_event: EventCreateDynamic_V20): void {
  handleInitializer();
}
export function handleInitializer_CreateDynamic_V21(_event: EventCreateDynamic_V21): void {
  handleInitializer();
}

export function handleInitializer_CreateDynamic_V22(_event: EventCreateDynamic_V22): void {
  handleInitializer();
}
export function handleInitializer_CreateDynamic_V23(_event: EventCreateDynamic_V23): void {
  handleInitializer();
}

/* -------------------------------------------------------------------------- */
/*                               LockupTranched                               */
/* -------------------------------------------------------------------------- */
export function handleInitializer_CreateTranched_V22(_event: EventCreateTranched_V22): void {
  handleInitializer();
}
export function handleInitializer_CreateTranched_V23(_event: EventCreateTranched_V23): void {
  handleInitializer();
}
