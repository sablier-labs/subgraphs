import type { Event } from "@envio/common/bindings";
import { getContract } from "@envio/common/contract";
import { Id } from "@envio/common/id";
import type { Context, Entity, EnvioEnum } from "@envio/lockup/bindings";
import type { Params } from "../helpers/params";
import { updateEntityBatchAndBatcher } from "./batch";

export async function createEntityStreamDynamic(
  context: Context.Handler,
  entities: EntitiesParams,
  event: Event,
  params: Params.CreateDynamic,
): Promise<Entity.Stream> {
  let stream = await createEntity(context, entities, event, params);
  // if (stream == null) {
  //   return null;
  // }
  // stream.cliff = false;
  // stream = addSegments(stream, dynamicParams.segments);
  // stream.save();
  // return stream;
  throw new Error("Not implemented");
}

export function createEntityStreamLinear(
  context: Context.Handler,
  entities: EntitiesParams,
  event: Event,
  params: Params.CreateLinear,
): Promise<Entity.Stream> {
  // let stream = createEntity(event, commonParams);
  // if (stream == null) {
  //   return null;
  // }
  // const unlockAmountStart = linearParams.unlockAmountStart;
  // if (unlockAmountStart) {
  //   if (unlockAmountStart.gt(ZERO)) {
  //     stream.initial = true;
  //     stream.initialAmount = unlockAmountStart;
  //   } else {
  //     stream.initial = false;
  //   }
  // }
  // stream = addCliffLL(stream, commonParams, linearParams);
  // if (stream == null) {
  //   return null;
  // }
  // stream.save();
  // return stream;
  throw new Error("Not implemented");
}

export function createEntityStreamTranched(
  context: Context.Handler,
  entities: EntitiesParams,
  event: Event,
  params: Params.CreateTranche,
): Promise<Entity.Stream> {
  // let stream = createEntity(event, commonParams);
  // if (stream == null) {
  //   return null;
  // }
  // stream.cliff = false;
  // stream = addTranches(stream, tranchedParams.tranches);
  // stream.save();
  // return stream;
  throw new Error("Not implemented");
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

/* -------------------------------------------------------------------------- */
/*                                  INTERNAL                                  */
/* -------------------------------------------------------------------------- */

type EntitiesParams = {
  asset: Entity.Asset;
  batch: Entity.Batch;
  batcher: Entity.Batcher;
  watcher: Entity.Watcher;
};

async function createEntity(
  context: Context.Handler,
  entities: EntitiesParams,
  event: Event,
  params: Params.CreateCommon,
): Promise<Entity.Stream> {
  const { asset, batch, batcher, watcher } = entities;

  const now = BigInt(event.block.timestamp);
  const streamId = Id.stream(event.srcAddress, event.chainId, params.tokenId);
  const contract = getContract("lockup", event.chainId, event.srcAddress);

  /* --------------------------------- STREAM --------------------------------- */
  const stream: Entity.Stream = {
    alias: Id.streamAlias(contract.alias, event.chainId, params.tokenId),
    asset_id: asset.id,
    assetDecimals: asset.decimals,
    availableAmount: 0n,
    batch_id: batch.id,
    category: params.category as EnvioEnum.StreamCategory,
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
    recipient: params.recipient.toLowerCase(),
    refundedAmount: 0n,
    sender: params.sender.toLowerCase(),
    snapshotAmount: 0n,
    startTime: now,
    subgraphId: BigInt(watcher.streamCounter),
    timestamp: now,
    tokenId: params.tokenId,
    transferable: params.transferable,
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
