import type { Address, Event } from "@envio-common/bindings";
import { Id } from "@envio-common/id";
import type { Context, Entity } from "@envio-lockup/bindings";

export async function create(context: Context.Handler, event: Event, sender: Address): Promise<Entity.Batcher> {
  const id = Id.batcher(event.chainId, sender);
  const batcher: Entity.Batcher = {
    batchCounter: 0n,
    id,
  };

  await context.Batcher.set(batcher);
  return batcher;
}

export async function updateCounter(context: Context.Handler, batcher: Entity.Batcher): Promise<void> {
  const updatedBatcher = {
    ...batcher,
    batchCounter: batcher.batchCounter + 1n,
  };
  await context.Batcher.set(updatedBatcher);
}
