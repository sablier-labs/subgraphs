import type { Event } from "@envio/common/bindings";
import type { Entity, HandlerContext, LoaderContext } from "@envio/flow/bindings";

export function createEntityWatcher(event: Event): Entity.Watcher {
  const watcher: Entity.Watcher = {
    id: event.chainId.toString(),
    actionCounter: 1n,
    chainId: BigInt(event.chainId),
    logs: [],
    streamCounter: 1n,
  };

  return watcher;
}

export async function getWatcherOrThrow(
  context: LoaderContext | HandlerContext,
  event: Event,
): Promise<Entity.Watcher> {
  const id = event.chainId.toString();
  const watcher = await context.Watcher.get(id);
  if (!watcher) {
    throw new Error(`Watcher not found in the database: ${id}`);
  }
  return watcher;
}
