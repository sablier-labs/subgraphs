import { Address, BigInt as BInt, ethereum } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "./constants";
import { Batch, Batcher } from "./flow/bindings/schema";

export function getOrCreateBatcher(sender: Address): Batcher {
  const id = sender.toHexString();
  let entity = Batcher.load(id);

  if (entity == null) {
    entity = new Batcher(id);
    entity.address = sender;
    entity.batchIndex = ZERO;
  }

  return entity;
}

export function getOrCreateBatch(event: ethereum.Event, sender: Address): Batch {
  const id = event.transaction.hash.toHexString();
  let entity = Batch.load(id);
  const batcher = getOrCreateBatcher(sender);

  if (entity == null) {
    entity = new Batch(id);
    entity.hash = event.transaction.hash;
    entity.timestamp = event.block.timestamp;
    entity.batcher = batcher.id;
    entity.size = ONE;
  } else {
    entity.size = entity.size.plus(ONE);
    if (BInt.compare(entity.size, ONE) === 1 && entity.label == null) {
      const label = batcher.batchIndex.plus(ONE).toString();
      entity.label = label;
      batcher.batchIndex = batcher.batchIndex.plus(ONE);
      batcher.save();
    }
  }

  entity.save();

  return entity;
}
