import { Address } from "@graphprotocol/graph-ts";
import {
  CreateLockupDynamicStream as EventCreateDynamic_V20,
  CreateLockupDynamicStream1 as EventCreateDynamic_V21,
  CreateLockupDynamicStream2 as EventCreateDynamic_V22,
  CreateLockupDynamicStream3 as EventCreateDynamic_V23,
  CreateLockupLinearStream as EventCreateLinear_V20,
  CreateLockupLinearStream1 as EventCreateLinear_V21,
  CreateLockupLinearStream2 as EventCreateLinear_V22,
  CreateLockupLinearStream3 as EventCreateLinear_V23,
  CreateLockupTranchedStream as EventCreateTranched_V22,
  CreateLockupTranchedStream1 as EventCreateTranched_V23,
  TransferAdmin as EventTransferAdmin,
} from "../generated/types/ContractInitializer/SablierLockupInitializer";
import {
  ContractLockupDynamic as DynamicTemplate,
  ContractLockupLinear as LinearTemplate,
  ContractLockupMerged as MergedTemplate,
  ContractLockupTranched as TranchedTemplate,
} from "../generated/types/templates";
import {
  getContractsDynamic,
  getContractsLinear,
  getContractsMerged,
  getContractsTranched,
} from "../constants";
import { createContract, getOrCreateWatcher } from "../helpers";

function createContractLinear(
  address: Address,
  alias: string,
  version: string,
): void {
  LinearTemplate.create(address);
  createContract(address, alias, version, "LockupLinear");
}

function createContractDynamic(
  address: Address,
  alias: string,
  version: string,
): void {
  DynamicTemplate.create(address);
  createContract(address, alias, version, "LockupDynamic");
}

function createContractTranched(
  address: Address,
  alias: string,
  version: string,
): void {
  TranchedTemplate.create(address);
  createContract(address, alias, version, "LockupTranched");
}

function createContractMerged(
  address: Address,
  alias: string,
  version: string,
): void {
  MergedTemplate.create(address);
  createContract(address, alias, version, "LockupMerged");
}

/**
 * Use the oldest contract as a trigger to start indexing all the other contracts.
 */

export function handleInitializer(): void {
  let watcher = getOrCreateWatcher();
  if (watcher.initialized) {
    return;
  } else {
    watcher.initialized = true;
    watcher.save();
  }

  let linearList = getContractsLinear();
  if (linearList.length > 0) {
    for (let i = 0; i < linearList.length; i++) {
      createContractLinear(
        Address.fromString(linearList[i][0]),
        linearList[i][1],
        linearList[i][2],
      );
    }
  }

  let dynamicList = getContractsDynamic();
  if (dynamicList.length > 0) {
    for (let i = 0; i < dynamicList.length; i++) {
      createContractDynamic(
        Address.fromString(dynamicList[i][0]),
        dynamicList[i][1],
        dynamicList[i][2],
      );
    }
  }

  let tranchedList = getContractsTranched();
  if (tranchedList.length > 0) {
    for (let i = 0; i < tranchedList.length; i++) {
      createContractTranched(
        Address.fromString(tranchedList[i][0]),
        tranchedList[i][1],
        tranchedList[i][2],
      );
    }
  }

  let mergedList = getContractsMerged();
  if (mergedList.length > 0) {
    for (let i = 0; i < mergedList.length; i++) {
      createContractMerged(
        Address.fromString(mergedList[i][0]),
        mergedList[i][1],
        mergedList[i][2],
      );
    }
  }
}

/** Genesis event from all contracts */
export function handleInitializer_Admin(_event: EventTransferAdmin): void {
  handleInitializer();
}
/** Backup genesis event from the Lockup Linear contract */
export function handleInitializer_CreateLinear_V20(
  _event: EventCreateLinear_V20,
): void {
  handleInitializer();
}
export function handleInitializer_CreateLinear_V21(
  _event: EventCreateLinear_V21,
): void {
  handleInitializer();
}

export function handleInitializer_CreateLinear_V22(
  _event: EventCreateLinear_V22,
): void {
  handleInitializer();
}

export function handleInitializer_CreateLinear_V23(
  _event: EventCreateLinear_V23,
): void {
  handleInitializer();
}

/** Backup genesis event from the Lockup Dynamic contract */
export function handleInitializer_CreateDynamic_V20(
  _event: EventCreateDynamic_V20,
): void {
  handleInitializer();
}
export function handleInitializer_CreateDynamic_V21(
  _event: EventCreateDynamic_V21,
): void {
  handleInitializer();
}

export function handleInitializer_CreateDynamic_V22(
  _event: EventCreateDynamic_V22,
): void {
  handleInitializer();
}
export function handleInitializer_CreateDynamic_V23(
  _event: EventCreateDynamic_V23,
): void {
  handleInitializer();
}

/** Backup genesis event from the Lockup Tranched contract */
export function handleInitializer_CreateTranched_V22(
  _event: EventCreateTranched_V22,
): void {
  handleInitializer();
}
export function handleInitializer_CreateTranched_V23(
  _event: EventCreateTranched_V23,
): void {
  handleInitializer();
}
