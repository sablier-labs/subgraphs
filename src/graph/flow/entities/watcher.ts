import { ONE } from "../../constants";
import { getChainId } from "../../context";
import { EntityWatcher } from "../bindings";

export function loadOrCreateEntityWatcher(): EntityWatcher {
  const id = getChainId().toString();
  let entity = EntityWatcher.load(id);

  if (entity == null) {
    entity = new EntityWatcher(id);
    entity.actionIndex = ONE;
    entity.chainId = getChainId();
    entity.initialized = false;
    entity.logs = [];
    entity.streamIndex = ONE;
  }

  return entity;
}
