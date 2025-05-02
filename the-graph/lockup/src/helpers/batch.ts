import { type Address, BigInt as GraphBigInt, type ethereum } from "@graphprotocol/graph-ts";
import { one, zero } from "../constants";
import { Batch, Batcher } from "../generated/types/schema";

export function getOrCreateBatcher(sender: Address): Batcher {
  const id = generateBatcherId(sender);
  let entity = Batcher.load(id);

  if (entity == null) {
    entity = new Batcher(id);
    entity.address = sender;
    entity.batchIndex = zero;
  }

  return entity;
}

export function getOrCreateBatch(event: ethereum.Event, sender: Address): Batch {
  const id = generateBatchId(event);
  let entity = Batch.load(id);
  const batcher = getOrCreateBatcher(sender);

  if (entity == null) {
    entity = new Batch(id);
    entity.hash = event.transaction.hash;
    entity.timestamp = event.block.timestamp;
    entity.batcher = batcher.id;
    entity.size = one;
  } else {
    entity.size = entity.size.plus(one);
    if (GraphBigInt.compare(entity.size, one) === 1 && entity.label == null) {
      const label = batcher.batchIndex.plus(one).toString();
      entity.label = label;
      batcher.batchIndex = batcher.batchIndex.plus(one);
      batcher.save();
    }
  }

  entity.save();

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateBatchId(event: ethereum.Event): string {
  return "".concat(event.transaction.hash.toHexString());
}

export function generateBatcherId(sender: Address): string {
  return "".concat(sender.toHexString());
}
