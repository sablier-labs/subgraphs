import { Address } from "@graphprotocol/graph-ts";
import { ContractFlow as FlowTemplate } from "../generated/types/templates";
import { TransferAdmin as EventTransferAdmin } from "../generated/types/templates/ContractFlow/SablierFlow";
import { getContractsFlow } from "../constants";
import { createContract, getOrCreateWatcher } from "../helpers";

/**
 * Use the oldest flow contract as a trigger to start indexing all the other contracts.
 */

export function handleInitializer(): void {
  let watcher = getOrCreateWatcher();
  if (watcher.initialized) {
    return;
  } else {
    watcher.initialized = true;
    watcher.save();
  }

  let factories = getContractsFlow();
  if (factories.length > 0) {
    for (let i = 0; i < factories.length; i++) {
      const address = Address.fromString(factories[i][0]);
      const alias = factories[i][1];
      const version = factories[i][2];

      FlowTemplate.create(address);
      createContract(address, alias, version);
    }
  }
}

export function handleInitializer_Admin(_event: EventTransferAdmin): void {
  handleInitializer();
}
