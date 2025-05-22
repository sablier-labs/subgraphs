import type { Context, Entity } from "@envio-lockup/bindings";

export function create(chainId: number): Entity.Watcher {
  const watcher: Entity.Watcher = {
    actionCounter: 1n,
    chainId: BigInt(chainId),
    id: chainId.toString(),
    logs: [],
    streamCounter: 1n,
  };

  return watcher;
}

export async function getOrThrow(context: Context.Loader | Context.Handler, chainId: number): Promise<Entity.Watcher> {
  const id = chainId.toString();
  const watcher = await context.Watcher.get(id);
  if (!watcher) {
    throw new Error(`Watcher not found in the database: ${id}`);
  }
  return watcher;
}
