import type { Event } from "@envio/common/bindings";
import type { Context, Entity } from "@envio/lockup/bindings";

export function createEntityWatcher(event: Event): Entity.Watcher {
  const watcher: Entity.Watcher = {
    actionCounter: 1n,
    chainId: BigInt(event.chainId),
    id: event.chainId.toString(),
    logs: [],
    streamCounter: 1n,
  };

  return watcher;
}

export async function getWatcherOrThrow(
  context: Context.Loader | Context.Handler,
  event: Event,
): Promise<Entity.Watcher> {
  const id = event.chainId.toString();
  const watcher = await context.Watcher.get(id);
  if (!watcher) {
    throw new Error(`Watcher not found in the database: ${id}`);
  }
  return watcher;
}
