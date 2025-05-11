import { ONE } from "../../constants";
import { getChainId } from "../../context";
import { EntityWatcher } from "../bindings";

export function getOrCreateEntityWatcher(): EntityWatcher {
  const id = "1";
  let entity = EntityWatcher.load(id);

  if (entity == null) {
    entity = new EntityWatcher(id);
    entity.actionIndex = ONE;
    entity.campaignIndex = ONE;
    entity.chainId = getChainId();
  }

  return entity;
}
