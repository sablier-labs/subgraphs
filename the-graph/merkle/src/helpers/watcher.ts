import { getChainId, one } from "../constants";
import { Watcher } from "../generated/types/schema";

export function getOrCreateWatcher(): Watcher {
  const id = "1";
  let entity = Watcher.load(id);

  if (entity == null) {
    entity = new Watcher(id);
    entity.chainId = getChainId();
    entity.actionIndex = one;
    entity.campaignIndex = one;
    entity.initialized = false;
    entity.logs = [];
  }

  return entity;
}
