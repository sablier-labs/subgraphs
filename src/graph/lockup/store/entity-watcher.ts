import { ONE } from "../../common/constants";
import { readChainId } from "../../common/context";
import { EntityWatcher } from "../bindings";

export function getOrCreateWatcher(): EntityWatcher {
  const chainId = readChainId();
  let watcher = EntityWatcher.load(chainId.toString());

  if (watcher === null) {
    watcher = new EntityWatcher(chainId.toString());
    watcher.actionCounter = ONE;
    watcher.chainId = chainId;
    watcher.streamCounter = ONE;
  }

  return watcher;
}
