import { getChainId, one } from "../constants";
import { Watcher } from "../generated/types/schema";

export function getOrCreateWatcher(): Watcher {
  const id = getChainId().toString();
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
