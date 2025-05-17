import type { Address, Event } from "@envio/common/bindings";
import { ids } from "@envio/common/ids";
import type { Entity, HandlerContext } from "@envio/flow/bindings";

export async function createEntityBatch(context: HandlerContext, event: Event, sender: Address): Promise<Entity.Batch> {
  const id = ids.batch(event);
  const batch: Entity.Batch = {
    id,
    batcher_id: ids.batcher(event, sender),
    hash: event.transaction.hash.toLowerCase(),
    label: undefined,
    size: 1n,
    timestamp: BigInt(event.block.timestamp),
  };

  await context.Batch.set(batch);
  return batch;
}

export async function createEntityBatcher(
  context: HandlerContext,
  event: Event,
  sender: Address,
): Promise<Entity.Batcher> {
  const id = ids.batcher(event, sender);
  const batcher: Entity.Batcher = {
    id,
    address: sender.toLowerCase(),
    batchCounter: 0n,
  };

  await context.Batcher.set(batcher);
  return batcher;
}

export async function updateEntityBatchAndBatcher(
  context: HandlerContext,
  batch: Entity.Batch,
  batcher: Entity.Batcher,
): Promise<void> {
  let label: string | undefined;
  const newBatchSize = batch.size + 1n;

  // Set the label for batches of 2+ streams.
  if (newBatchSize === 2n) {
    if (batch.label !== null) {
      throw new Error(`Batch label is already set when batch size is 2: ${batch.id} ${batcher.id}`);
    }
    const newCounter: bigint = batcher.batchCounter + 1n;
    label = newCounter.toString();

    // Update Batcher
    const updatedBatcher = {
      ...batcher,
      batchCounter: newCounter,
    };
    await context.Batcher.set(updatedBatcher);
  }

  // Update Batch
  const updatedBatch = {
    ...batch,
    label,
    size: newBatchSize,
  };
  await context.Batch.set(updatedBatch);
}
