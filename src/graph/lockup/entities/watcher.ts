import { ONE } from "../../constants";
import { getChainId } from "../../context";
import { EntityWatcher } from "../bindings";

export function getOrCreateEntityWatcher(): EntityWatcher {
  const chainId = getChainId().toString();
  let watcher = EntityWatcher.load(chainId);

  if (watcher == null) {
    watcher = new EntityWatcher(chainId);
    watcher.actionIndex = ONE;
    watcher.chainId = getChainId();
    watcher.initialized = false;
    watcher.logs = [];
    watcher.streamIndex = ONE;
  }

  return watcher;
}
