import { ONE } from "../../constants";
import { getChainId } from "../../context";
import { EntityWatcher } from "../bindings";

export function getOrCreateEntityWatcher(): EntityWatcher {
  const chainId = getChainId();
  let watcher = EntityWatcher.load(chainId.toString());

  if (watcher == null) {
    watcher = new EntityWatcher(chainId.toString());
    watcher.actionIndex = ONE;
    watcher.chainId = chainId;
    watcher.streamIndex = ONE;
  }

  return watcher;
}
