import type { Context, Entity } from "../bindings";

export async function get(
  context: Context.Loader | Context.Handler,
  chainId: number,
): Promise<Entity.Watcher | undefined> {
  const id = chainId.toString();
  const watcher = await context.Watcher.get(id);
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
