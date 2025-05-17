import { Address, ethereum } from "@graphprotocol/graph-ts";
import { ONE, TWO, ZERO } from "../../common/constants";
import { logError } from "../../common/logger";
import { EntityBatch, EntityBatcher } from "../bindings";

/**
 * This function may be executed multiple times within the same block:
 *
 * 1. For the 1st stream, the Batch entity is created but the label is left null.
 * 2. For the 2nd stream, the label is set and the size is incremented.
 * 3. For the 3rd stream and later, only the size is updated.
 *
 * The rationale is that fully creating the batch entity makes sense only if there are at least 2 streams.
 */
export function getOrCreateEntityBatch(event: ethereum.Event, sender: Address): EntityBatch {
  const id = event.transaction.hash.toHexString();
  const batcher = getOrCreateEntityBatcher(sender);

  let batch = EntityBatch.load(id);
  if (batch === null) {
    batch = new EntityBatch(id);
    batch.hash = event.transaction.hash;
    batch.batcher = batcher.id;
    batch.size = ONE;
    batch.timestamp = event.block.timestamp;
  } else {
    batch.size = batch.size.plus(ONE);

    // Set the label for batches of 2+ streams.
    if (batch.size === TWO) {
      if (batch.label !== null) {
        logError("Batch label is already set when batch size is 2: {} {}", [batch.id, batcher.id]);
      }
      const newCounter = batcher.batchCounter.plus(ONE);
      batch.label = newCounter.toString();
      batcher.batchCounter = newCounter;
      batcher.save();
    }
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
    batcher.batchCounter = ZERO;
    batcher.save();
  }

  return batcher;
}
