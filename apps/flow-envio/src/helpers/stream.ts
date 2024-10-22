import type {
  Address,
  Asset,
  Batch,
  Batcher,
  Contract,
  Event,
  Stream,
  Watcher,
  CreateArgs,
} from "../types";

import { configuration, StreamCategory } from "../constants";

export function createStream(
  event: Event<CreateArgs>,
  entities: {
    asset: Asset;
    batch: Batch;
    batcher: Batcher;
    contract: Contract;
    watcher: Watcher;
  },
) {
  let { asset, batch, batcher, contract, watcher } = entities;
  const tokenId = event.params.streamId;

  const id = generateStreamId(event, contract.address, tokenId);
  const alias = generateStreamAlias(event, contract.address, tokenId);

  /** --------------- */

  const stream: Stream = {
    id,
    tokenId,
    alias,
    asset_id: asset.id,
    category: StreamCategory.Flow,
    contract_id: contract.id,
    version: contract.version,
    subgraphId: BigInt(watcher.streamIndex),
    hash: event.transaction.hash.toLowerCase(),
    timestamp: BigInt(event.block.timestamp),
    chainId: BigInt(event.chainId),
    startTime: BigInt(event.block.timestamp),
    depletionTime: BigInt(event.block.timestamp),
    transferable: true,
    creator: event.transaction.from!.toLowerCase(),
    sender: event.params.sender.toLowerCase(),
    recipient: event.params.recipient.toLowerCase(),
    ratePerSecond: event.params.ratePerSecond,

    /** --------------- */
    refundedAmount: 0n,
    withdrawnAmount: 0n,
    availableAmount: 0n,
    depositedAmount: 0n,
    snapshotAmount: 0n,
    protocolFeeAmount: 0n,
    forgivenDebt: 0n,

    /** --------------- */
    paused: false,
    pausedAction_id: undefined,
    pausedTime: undefined,

    voided: false,
    voidedAction_id: undefined,
    voidedTime: undefined,

    lastAdjustmentAction_id: undefined,
    lastAdjustmentTimestamp: BigInt(event.block.timestamp),

    /** --------------- */
    batch_id: batch.id,
    position: BigInt(batch.size),
  };

  /** --------------- */

  watcher = {
    ...watcher,
    streamIndex: BigInt(watcher.streamIndex) + 1n,
  };

  /** --------------- */

  const post_batch = (() => {
    const size = BigInt(batch.size) + 1n;

    if (batch.size === 1n && !batch.label) {
      /**
       * If the batch already has its first element (now adding the second),
       * assign it a label and bump the batcher's index
       */
      const index = BigInt(batcher.batchIndex) + 1n;
      const label = index.toString();

      return {
        batch: {
          ...batch,
          label,
          size,
        },
        batcher: {
          ...batcher,
          batchIndex: index,
        },
      };
    }

    return {
      batch: {
        ...batch,
        size,
      },
      batcher,
    };
  })();

  batch = post_batch.batch;
  batcher = post_batch.batcher;

  return {
    batch,
    batcher,
    stream,
    watcher,
  };
}

export async function getStream(
  event: Event,
  tokenId: bigint | string,
  loader: (id: string) => Promise<Stream | undefined>,
) {
  const id = generateStreamId(event, event.srcAddress, tokenId);
  const stream = await loader(id);

  if (!stream) {
    throw new Error("Missing stream instance");
  }

  return stream;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateStreamId(
  event: Event,
  address: Address,
  tokenId: bigint | string,
) {
  let id = ""
    .concat(address.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}

export function generateStreamAlias(
  event: Event,
  address: Address,
  tokenId: bigint,
) {
  const chain = configuration(event.chainId);
  const contract = chain.contracts.find(
    (c) => c.address === address.toLowerCase(),
  );

  if (!contract) {
    throw new Error("Missing or mismatched contract in configuration");
  }

  let id = ""
    .concat(contract.alias.toLowerCase())
    .concat("-")
    .concat(event.chainId.toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}
