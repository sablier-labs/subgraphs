import type { Envio } from "../../common/bindings";
import { Id } from "../../common/id";
import type { Context, Entity } from "../bindings";

export async function create(
  context: Context.Handler,
  event: Envio.Event,
  sender: Envio.Address,
): Promise<Entity.Batcher> {
  const batcher: Entity.Batcher = {
    batchCounter: 0n,
    id: Id.batcher(event.chainId, sender),
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
