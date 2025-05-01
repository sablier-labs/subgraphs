import { Watcher } from "../generated/types/schema";
import { getChainId, one } from "../constants";

export function getOrCreateWatcher(): Watcher {
  let id = "1";
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
