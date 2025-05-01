import { Watcher } from "../generated/types/schema";
import { getChainId, one } from "../constants";

export function getOrCreateWatcher(): Watcher {
  let id = getChainId().toString();
  let entity = Watcher.load(id);

  if (entity == null) {
    entity = new Watcher(id);
    entity.chainId = getChainId();
    entity.streamIndex = one;
    entity.actionIndex = one;
    entity.initialized = false;
    entity.logs = [];
  }

  return entity;
}
