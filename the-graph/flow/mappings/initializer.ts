import { Address } from "@graphprotocol/graph-ts";
import { getFlowContracts } from "../../../src";
import { getChainId } from "../../shared";
import { EventCreate, EventTransferAdmin, TemplateFlow } from "../bindings";
import { createContract, getOrCreateWatcher } from "../schema";

/** Using the first Flow contract as a trigger to start indexing all the other contracts. */
export function handleInitializer(): void {
  const watcher = getOrCreateWatcher();
  if (watcher.initialized) {
    return;
  }
  watcher.initialized = true;
  watcher.save();

  const chainId = getChainId().toI64();
  const contracts = getFlowContracts(chainId);
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const address = Address.fromString(contract.address);
    TemplateFlow.create(address);
    createContract(address, contract.alias, contract.version);
  }
}

export function handleInitializer_Admin(_event: EventTransferAdmin): void {
  handleInitializer();
}

export function handleInitializer_Create_V10(_event: EventCreate): void {
  handleInitializer();
}
