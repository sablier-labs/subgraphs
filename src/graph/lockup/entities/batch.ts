import { Address, ethereum } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "../../constants";
import { EntityBatch, EntityBatcher } from "../bindings";

export function getOrCreateEntityBatch(event: ethereum.Event, sender: Address): EntityBatch {
  const id = event.transaction.hash.toHexString();

  const batcher = getOrCreateEntityBatcher(sender);

  let batch = EntityBatch.load(id);
  if (batch == null) {
    batch = new EntityBatch(id);
    batch.batcher = batcher.id;
    batch.hash = event.transaction.hash;
    batch.size = ONE;
    batch.timestamp = event.block.timestamp;
  } else {
    batch.size = batch.size.plus(ONE);
    if (batch.size.equals(ONE) && batch.label == null) {
      const label = batcher.batchIndex.plus(ONE).toString();
      batch.label = label;
      batcher.batchIndex = batcher.batchIndex.plus(ONE);
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
    batcher.batchIndex = ZERO;
    batcher.save();
  }

  return batcher;
}
