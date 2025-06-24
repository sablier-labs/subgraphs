import type { Common } from "../bindings";

/**
 * The entity is not set here because it will be set later in the `update` function.
 */
export function create<TWatcher extends Common.StreamWatcher>(chainId: number): TWatcher {
  const watcher: Common.StreamWatcher = {
    actionCounter: 0n,
    chainId: BigInt(chainId),
    id: chainId.toString(),
    logs: [],
    streamCounter: 0n,
  };
  return watcher as TWatcher;
}

export async function update<
  TContext extends { Watcher: { set: (watcher: TWatcher) => void | Promise<void> } },
  TWatcher extends Common.StreamWatcher,
>(context: TContext, watcher: TWatcher): Promise<void> {
  const updatedWatcher = {
    ...watcher,
    actionCounter: watcher.actionCounter + 1n,
    streamCounter: watcher.streamCounter + 1n,
  };
  await context.Watcher.set(updatedWatcher);
}
