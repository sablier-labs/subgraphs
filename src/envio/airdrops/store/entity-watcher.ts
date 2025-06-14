import type { Context, Entity } from "../bindings";

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

export function exists(chainId: number, watcher?: Entity.Watcher): asserts watcher is Entity.Watcher {
  if (!watcher) {
    throw new Error(`Watcher not loaded from the entity store: ${chainId}`);
  }
}

export async function get(
  context: Context.Loader | Context.Handler,
  chainId: number,
): Promise<Entity.Watcher | undefined> {
  const id = chainId.toString();
  const watcher = await context.Watcher.get(id);
  return watcher;
}
