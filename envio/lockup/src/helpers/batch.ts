import type { Address, Batch, Batcher, Event } from "../types";

export async function getOrCreateBatch(
  event: Event,
  batcher: Batcher,
  loader: (id: string) => Promise<Batch | undefined>,
) {
  const id = generateBatchId(event);
  const loaded = await loader(id);

  if (!loaded) {
    return createBatch(event, batcher);
  }

  return loaded;
}

export async function getOrCreateBatcher(
  event: Event,
  sender: Address,
  loader: (id: string) => Promise<Batcher | undefined>,
) {
  const id = generateBatcherId(event, sender);
  const loaded = await loader(id);

  if (!loaded) {
    return createBatcher(event, sender);
  }

  return loaded;
}

export function createBatcher(event: Event, sender: Address) {
  const entity: Batcher = {
    id: generateBatcherId(event, sender),
    address: sender.toLowerCase(),
    batchIndex: 0n,
  };

  return entity;
}

export function createBatch(event: Event, batcher: Batcher) {
  const entity: Batch = {
    id: generateBatchId(event),
    batcher_id: batcher.id,
    hash: event.transaction.hash.toLowerCase(),
    timestamp: BigInt(event.block.timestamp),
    label: undefined,
    size: 0n,
  };

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateBatchId(event: Event): string {
  return ""
    .concat(event.transaction.hash.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString());
}

export function generateBatcherId(event: Event, sender: Address): string {
  return ""
    .concat(sender.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString());
}
