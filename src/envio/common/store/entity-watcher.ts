import type { Common } from "../bindings";

type WatcherContext = {
  Watcher: { set: (watcher: Common.StreamWatcher) => void | Promise<void> };
};

/**
 * The entity is not set here because it will be set later in the `update` function.
 */
export function create(chainId: number): Common.StreamWatcher {
  const watcher: Common.StreamWatcher = {
    actionCounter: 1n,
    chainId: BigInt(chainId),
    id: chainId.toString(),
    logs: [],
    streamCounter: 1n,
  };
  return watcher;
}

export async function incrementActionCounter(context: WatcherContext, watcher: Common.StreamWatcher): Promise<void> {
  const updatedWatcher = {
    ...watcher,
    actionCounter: watcher.actionCounter + 1n,
  };
  await context.Watcher.set(updatedWatcher);
}

export async function incrementCounters(context: WatcherContext, watcher: Common.StreamWatcher): Promise<void> {
  const updatedWatcher = {
    ...watcher,
    actionCounter: watcher.actionCounter + 1n,
    streamCounter: watcher.streamCounter + 1n,
  };
  await context.Watcher.set(updatedWatcher);
}
