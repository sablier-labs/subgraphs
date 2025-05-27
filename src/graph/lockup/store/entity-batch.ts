import { Address, ethereum } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "../../common/constants";
import { Id } from "../../common/id";
import { EntityBatch, EntityBatcher } from "../bindings";

/**
 * This function may be run multiple times within the same transaction:
 *
 * 1. For the 1st stream, the Batch entity is created but all other fields are left null.
 * 2. For the 2nd stream, all fields are set.
 * 3. For the 3rd stream and later, only the size is updated.
 *
 * The rationale is that creating the batch entity makes sense only if there are at least 2 streams.
 */
export function getOrCreateBatch(event: ethereum.Event, sender: Address): EntityBatch {
  const id = Id.batch(event.transaction.hash, sender);
  const batcher = getOrCreateBatcher(sender);

  let batch = EntityBatch.load(id);
  if (batch === null) {
    batch = new EntityBatch(id);
    batch.size = ZERO;
  } else {
    const hash = batch.hash;
    if (hash === null) {
      batch.batcher = batcher.id;
      batch.hash = event.transaction.hash;
      batch.size = ONE;
      batch.timestamp = event.block.timestamp;
    } else {
      batch.size = batch.size.plus(ONE);
      batcher.batchCounter = batcher.batchCounter.plus(ONE);
      batcher.save();
    }
  }

  batch.save();
  return batch;
}

function getOrCreateBatcher(sender: Address): EntityBatcher {
  const id = sender.toHexString();
  let batcher = EntityBatcher.load(id);

  if (batcher == null) {
    batcher = new EntityBatcher(id);
    batcher.batchCounter = ZERO;
    batcher.save();
  }

  return batcher;
}
