import { Flow as enums } from "../../../schema/enums";
import type { Event } from "../../common/bindings";
import { getContract } from "../../common/contract";
import { Id } from "../../common/id";
import type { Args, Context, Entity } from "../bindings";
import { updateEntityBatchAndBatcher } from "./batch";

export async function createEntityStream(
  context: Context.Handler,
  entities: {
    asset: Entity.Asset;
    batch: Entity.Batch;
    batcher: Entity.Batcher;
    watcher: Entity.Watcher;
  },
  event: Event<Args.Create>,
): Promise<Entity.Stream> {
  const { asset, batch, batcher, watcher } = entities;

  const now = BigInt(event.block.timestamp);
  const tokenId = event.params.streamId;
  const streamId = Id.stream(event.srcAddress, event.chainId, tokenId);
  const contract = getContract("flow", event.chainId, event.srcAddress);

  /* --------------------------------- STREAM --------------------------------- */
  const stream: Entity.Stream = {
    alias: Id.streamAlias(contract.alias, event.chainId, tokenId),
    asset_id: asset.id,
    assetDecimals: asset.decimals,
    availableAmount: 0n,
    batch_id: batch.id,
    category: enums.StreamCategory.Flow,
    chainId: BigInt(event.chainId),
    contract: event.srcAddress,
    creator: event.transaction.from?.toLowerCase() || "",
    depletionTime: now,
    depositedAmount: 0n,
    forgivenDebt: 0n,
    hash: event.transaction.hash.toLowerCase(),
    id: streamId,
    lastAdjustmentAction_id: undefined,
    lastAdjustmentTimestamp: now,
    paused: false,
    pausedAction_id: undefined,
    pausedTime: undefined,
    position: batch.size,
    ratePerSecond: event.params.ratePerSecond,
    recipient: event.params.recipient.toLowerCase(),
    refundedAmount: 0n,
    sender: event.params.sender.toLowerCase(),
    snapshotAmount: 0n,
    startTime: now,
    subgraphId: BigInt(watcher.streamCounter),
    timestamp: now,
    tokenId,
    transferable: event.params.transferable,
    version: contract.version,
    voided: false,
    voidedAction_id: undefined,
    voidedTime: undefined,
    withdrawnAmount: 0n,
  };

  /* ---------------------------------- BATCH --------------------------------- */
  await updateEntityBatchAndBatcher(context, batch, batcher);

  /* --------------------------------- WATCHER -------------------------------- */
  const updatedWatcher = {
    ...watcher,
    streamCounter: watcher.streamCounter + 1n,
  };
  await context.Watcher.set(updatedWatcher);

  return stream;
}

export async function getStreamOrThrow(
  context: Context.Loader,
  event: Event,
  tokenId: bigint | string,
): Promise<Entity.Stream> {
  const id = Id.stream(event.srcAddress, event.chainId, tokenId);
  const stream = await context.Stream.get(id);
  if (!stream) {
    throw new Error(`Stream not loaded from the database: ${id}`);
  }
  return stream;
}
