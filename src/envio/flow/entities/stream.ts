import { Flow as enums } from "../../../schema/enums";
import type { Event } from "../../common/bindings";
import { getContract } from "../../common/contract";
import { ids } from "../../common/ids";
import type { Args, Entity, HandlerContext, LoaderContext } from "../bindings";
import { updateEntityBatchAndBatcher } from "./batch";

export async function createEntityStream(
  context: HandlerContext,
  entities: {
    asset: Entity.Asset;
    batch: Entity.Batch;
    batcher: Entity.Batcher;
    watcher: Entity.Watcher;
  },
  event: Event<Args.Create>,
): Promise<Entity.Stream> {
  const { asset, batch, batcher, watcher } = entities;

  // Setup
  const now = BigInt(event.block.timestamp);
  const tokenId = event.params.streamId;
  const streamId = ids.stream(event.srcAddress, event.chainId, tokenId);
  const contract = getContract("flow", event.chainId, event.srcAddress);

  // Stream
  const stream: Entity.Stream = {
    id: streamId,
    subgraphId: BigInt(watcher.streamCounter),
    tokenId,

    // Asset
    asset_id: asset.id,
    assetDecimals: asset.decimals,

    // Batch
    batch_id: batch.id,
    position: batch.size - 1n,

    // Stream fields
    alias: ids.streamAlias(contract.alias, event.chainId, tokenId),
    category: enums.StreamCategory.Flow,
    chainId: BigInt(event.chainId),
    contract: event.srcAddress,
    creator: event.transaction.from?.toLowerCase() || "",
    depletionTime: now,
    hash: event.transaction.hash.toLowerCase(),
    lastAdjustmentTimestamp: now,
    ratePerSecond: event.params.ratePerSecond /** [Scaled 18D] */,
    recipient: event.params.recipient.toLowerCase(),
    sender: event.params.sender.toLowerCase(),
    startTime: now,
    timestamp: now,
    transferable: event.params.transferable,
    version: contract.version,

    // Stream defaults
    availableAmount: 0n,
    depositedAmount: 0n,
    forgivenDebt: 0n,
    lastAdjustmentAction_id: undefined,
    paused: false,
    pausedAction_id: undefined,
    pausedTime: undefined,
    refundedAmount: 0n,
    voided: false,
    voidedAction_id: undefined,
    voidedTime: undefined,
    snapshotAmount: 0n,
    withdrawnAmount: 0n,
  };

  // Batch and Batcher
  await updateEntityBatchAndBatcher(context, batch, batcher);

  // Watcher
  const updatedWatcher = {
    ...watcher,
    streamCounter: watcher.streamCounter + 1n,
  };
  await context.Watcher.set(updatedWatcher);

  return stream;
}

export async function getStreamOrThrow(
  context: LoaderContext,
  event: Event,
  tokenId: bigint | string,
): Promise<Entity.Stream> {
  const id = ids.stream(event.srcAddress, event.chainId, tokenId);
  const stream = await context.Stream.get(id);
  if (!stream) {
    throw new Error(`Stream not loaded from the database: ${id}`);
  }
  return stream;
}
