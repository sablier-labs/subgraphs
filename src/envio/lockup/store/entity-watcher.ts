import type { Context, Entity } from "../bindings";

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
