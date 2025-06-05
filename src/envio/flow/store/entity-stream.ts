import { Flow as enums } from "../../../schema/enums";
import type { Envio } from "../../common/bindings";
import { getContract } from "../../common/deployments";
import { Id } from "../../common/id";
import type { Context, Entity } from "../bindings";
import { type CreateEntities, type Params } from "../helpers/types";
import { update as updateBatch } from "./entity-batch";

export async function create(
  context: Context.Handler,
  event: Envio.Event,
  entities: CreateEntities,
  params: Params.Create,
): Promise<Entity.Stream> {
  const { asset, batch, batcher, watcher } = entities;

  const counter = watcher.streamCounter;
  const now = BigInt(event.block.timestamp);
  const tokenId = params.tokenId;
  const streamId = Id.stream(event.srcAddress, event.chainId, tokenId);
  const flow = getContract("flow", event.chainId, event.srcAddress);

  /* --------------------------------- STREAM --------------------------------- */
  const stream: Entity.Stream = {
    alias: Id.streamAlias(flow.alias, event.chainId, tokenId),
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
    subgraphId: counter,
    timestamp: now,
    tokenId: tokenId,
    transferable: params.transferable,
    version: flow.version,
    voided: false,
    voidedAction_id: undefined,
    voidedTime: undefined,
    withdrawnAmount: 0n,
  };
  await context.Stream.set(stream);

  /* ---------------------------------- BATCH --------------------------------- */
  await updateBatch(context, event, batch, batcher);

  /* --------------------------------- WATCHER -------------------------------- */
  const updatedWatcher = {
    ...watcher,
    streamCounter: counter + 1n,
  };
  await context.Watcher.set(updatedWatcher);

  return stream;
}

export async function get(
  context: Context.Handler | Context.Loader,
  event: Envio.Event,
  tokenId: bigint | string,
): Promise<Entity.Stream | undefined> {
  const id = Id.stream(event.srcAddress, event.chainId, tokenId);
  const stream = await context.Stream.get(id);
  return stream;
}

export function exists(
  stream: Entity.Stream | undefined,
  event: Envio.Event,
  tokenId: bigint | string,
): asserts stream is Entity.Stream {
  if (!stream) {
    const id = Id.stream(event.srcAddress, event.chainId, tokenId);
    throw new Error(`Stream not loaded from the entity store: ${id}`);
  }
}
