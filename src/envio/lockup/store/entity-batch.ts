import type { Envio } from "@envio-common/bindings";
import { Id } from "@envio-common/id";
import type { Context, Entity } from "@envio-lockup/bindings";
import { updateCounter as updateBatcherCounter } from "./entity-batcher";

export async function create(event: Envio.Event, sender: Envio.Address): Promise<Entity.Batch> {
  const id = Id.batch(event, sender);
  const batch: Entity.Batch = {
    batcher_id: Id.batcher(event.chainId, sender),
    hash: "",
    id,
    size: 0n,
    timestamp: BigInt(event.block.timestamp),
  };
  return batch;
}

/**
 * This function may be run multiple times within the same transaction:
 *
 * 1. For the 1st stream, only the size is updated.
 * 2. For the 2nd stream, all fields are set to signal the existence of the batch.
 * 3. For the 3rd stream and later, only the size is updated.
 *
 * The rationale is that creating the batch entity makes sense only if there are at least 2 streams.
 */
export async function update(
  context: Context.Handler,
  event: Envio.Event,
  batch: Entity.Batch,
  batcher: Entity.Batcher,
): Promise<void> {
  const newBatchSize = batch.size + 1n;

  if (newBatchSize === 2n) {
    const updatedBatch: Entity.Batch = {
      ...batch,
      hash: event.transaction.hash.toLowerCase(),
      size: newBatchSize,
      timestamp: BigInt(event.block.timestamp),
    };
    await context.Batch.set(updatedBatch);
    await updateBatcherCounter(context, batcher);
  } else {
    const updatedBatch: Entity.Batch = {
      ...batch,
      size: newBatchSize,
    };
    await context.Batch.set(updatedBatch);
  }
}
