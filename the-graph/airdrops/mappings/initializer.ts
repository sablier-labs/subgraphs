import { Address, ethereum } from "@graphprotocol/graph-ts";
import { TemplateMerkleFactory } from "../bindings";
import { getContractsFactory } from "../config";
import { createFactory, getOrCreateWatcher } from "../schema";

/**
 * Use the oldest linear contract as a trigger to start indexing all the other contracts.
 */

export function handleInitializer(_event: ethereum.Event): void {
  const watcher = getOrCreateWatcher();
  if (watcher.initialized) {
    return;
  }
  watcher.initialized = true;
  watcher.save();

  const factories = getContractsFactory();
  if (factories.length > 0) {
    for (let i = 0; i < factories.length; i++) {
      const address = Address.fromString(factories[i][0]);
      const alias = factories[i][1];
      const version = factories[i][2];

      TemplateMerkleFactory.create(address);
      createFactory(address, alias, version);
    }
  }
}
