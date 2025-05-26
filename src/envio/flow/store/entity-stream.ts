import type { Envio } from "@envio-common/bindings";
import { getContract } from "@envio-common/deployments";
import { Id } from "@envio-common/id";
import type { Context, Entity } from "@envio-flow/bindings";
import { type CreateEntities, type Params } from "@envio-flow/helpers/types";
import { Flow as enums } from "@src/schema/enums";
import { update as updateBatch } from "./entity-batch";

export async function create(
  context: Context.Handler,
  event: Envio.Event,
  entities: CreateEntities,
  params: Params.Create,
): Promise<Entity.Stream> {
  const { asset, batch, batcher, watcher } = entities;

  const now = BigInt(event.block.timestamp);
  const streamId = Id.stream(event.srcAddress, event.chainId, params.tokenId);
  const flow = getContract("flow", event.chainId, event.srcAddress);

  /* --------------------------------- STREAM --------------------------------- */
  const stream: Entity.Stream = {
    alias: Id.streamAlias(flow.alias, event.chainId, params.tokenId),
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
    hash: event.transaction.hash,
    id: streamId,
    lastAdjustmentAction_id: undefined,
    lastAdjustmentTimestamp: now,
    paused: false,
    pausedAction_id: undefined,
    pausedTime: undefined,
    position: batch.size,
    ratePerSecond: params.ratePerSecond,
    recipient: params.recipient.toLowerCase(),
    refundedAmount: 0n,
    sender: params.sender.toLowerCase(),
    snapshotAmount: 0n,
    startTime: now,
    subgraphId: BigInt(watcher.streamCounter),
    timestamp: now,
    tokenId: params.tokenId,
    transferable: params.transferable,
    version: flow.version,
    voided: false,
    voidedAction_id: undefined,
    voidedTime: undefined,
    withdrawnAmount: 0n,
  };

  /* ---------------------------------- BATCH --------------------------------- */
  await updateBatch(context, event, batch, batcher);

  /* --------------------------------- WATCHER -------------------------------- */
  const updatedWatcher = {
    ...watcher,
    streamCounter: watcher.streamCounter + 1n,
  };
  await context.Watcher.set(updatedWatcher);

  return stream;
}

export async function getOrThrow(
  context: Context.Loader,
  event: Envio.Event,
  tokenId: bigint | string,
): Promise<Entity.Stream> {
  const id = Id.stream(event.srcAddress, event.chainId, tokenId);
  const stream = await context.Stream.get(id);
  if (!stream) {
    throw new Error(`Stream not loaded from the entity store: ${id}`);
  }
  return stream;
}
