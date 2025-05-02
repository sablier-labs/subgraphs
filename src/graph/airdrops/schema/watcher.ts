import { ONE } from "../../constants";
import { getChainId } from "../../getters";
import { EntityWatcher } from "../bindings";

export function getOrCreateWatcher(): EntityWatcher {
  const id = "1";
  let entity = EntityWatcher.load(id);

  if (entity == null) {
    entity = new EntityWatcher(id);
    entity.actionIndex = ONE;
    entity.campaignIndex = ONE;
    entity.chainId = getChainId();
    entity.initialized = false;
    entity.logs = [];
  }

  return entity;
}
