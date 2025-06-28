import type { Context, Entity } from "../bindings";

/**
 * The entity is not set here because it will be set later in the `update` function.
 */
export function create(chainId: number): Entity.Watcher {
  const watcher: Entity.Watcher = {
    actionCounter: 1n,
    campaignCounter: 1n,
    chainId: BigInt(chainId),
    id: chainId.toString(),
    logs: [],
  };
  return watcher;
}

export async function update(context: Context.Handler, watcher: Entity.Watcher): Promise<void> {
  const updatedWatcher = {
    ...watcher,
    actionCounter: watcher.actionCounter + 1n,
    campaignCounter: watcher.campaignCounter + 1n,
  };
  await context.Watcher.set(updatedWatcher);
}
