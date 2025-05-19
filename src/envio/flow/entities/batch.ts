import type { Address, Event } from "@envio/common/bindings";
import { Id } from "@envio/common/id";
import type { Context, Entity } from "@envio/flow/bindings";

export async function createEntityBatch(
  context: Context.Handler,
  event: Event,
  sender: Address,
): Promise<Entity.Batch> {
  const id = Id.batch(event, sender);
  const batch: Entity.Batch = {
    batcher_id: Id.batcher(event, sender),
    hash: event.transaction.hash.toLowerCase(),
    id,
    size: 0n,
    timestamp: BigInt(event.block.timestamp),
  };

  await context.Batch.set(batch);
  return batch;
}

export async function createEntityBatcher(
  context: Context.Handler,
  event: Event,
  sender: Address,
): Promise<Entity.Batcher> {
  const id = Id.batcher(event, sender);
  const batcher: Entity.Batcher = {
    batchCounter: 0n,
    id,
  };

  await context.Batcher.set(batcher);
  return batcher;
}

/**
 * This function may be run multiple times within the same transaction:
 *
 * 1. For the 1st stream, the Batch entity is created but all other fields are left null.
 * 2. For the 2nd stream, all fields are set.
 * 3. For the 3rd stream and later, only the size is updated.
 *
 * The rationale is that creating the batch entity makes sense only if there are at least 2 streams.
 */
export async function updateEntityBatchAndBatcher(
  context: Context.Handler,
  batch: Entity.Batch,
  batcher: Entity.Batcher,
): Promise<void> {
  // Update Batch
  const newBatchSize = batch.size + 1n;
  const updatedBatch = {
    ...batch,
    size: newBatchSize,
  };
  await context.Batch.set(updatedBatch);

  if (newBatchSize === 2n) {
    const newCounter: bigint = batcher.batchCounter + 1n;

    // Update Batcher
    const updatedBatcher = {
      ...batcher,
      batchCounter: newCounter,
    };
    await context.Batcher.set(updatedBatcher);
  }
}
