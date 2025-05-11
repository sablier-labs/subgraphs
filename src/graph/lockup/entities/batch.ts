import { Address, ethereum } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "../../constants";
import { EntityBatch, EntityBatcher } from "../bindings";

/**
 * This function may be executed multiple times within the same block:
 *
 * 1. For the 1st stream, the Batch entity is created but no fields are initialized.
 * 2. For the 2nd stream, all fields of the Batch entity are initialized.
 * 3. For the 3rd stream and later, only the size of the Batch entity is updated.
 *
 * The rationale is that fully creating the batch entity makes sense only if there are at least two streams.
 */
export function getOrCreateEntityBatch(event: ethereum.Event, sender: Address): EntityBatch {
  const id = event.transaction.hash.toHexString();
  let batch = EntityBatch.load(id);
  if (batch === null) {
    batch = new EntityBatch(id);
    batch.save();
    return batch;
  }

  const batcher = getOrCreateEntityBatcher(sender);

  // If the hash is null, this is the 2nd stream.
  if (batch.hash === null) {
    batch.batcher = batcher.id;
    batch.hash = event.transaction.hash;
    batch.size = ONE;
    batch.timestamp = event.block.timestamp;

    batcher.batchIndex = batcher.batchIndex.plus(ONE);
    batcher.save();
  } else {
    batch.size = batch.size.plus(ONE);
  }

  batch.save();
  return batch;
}

function getOrCreateEntityBatcher(sender: Address): EntityBatcher {
  const id = sender.toHexString();
  let batcher = EntityBatcher.load(id);

  if (batcher == null) {
    batcher = new EntityBatcher(id);
    batcher.address = sender;
    batcher.batchIndex = ZERO;
    batcher.save();
  }

  return batcher;
}
