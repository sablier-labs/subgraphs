import type { Event } from "@envio-common/bindings";
import { getContract } from "@envio-common/deployments";
import { Id } from "@envio-common/id";
import type { Context, Entity, EnvioEnum } from "@envio-lockup/bindings";
import { Version } from "@sablier/deployments";
import type { CreateEntities, Params } from "../helpers/types";
import { update as updateBatch } from "./entity-batch";
import { create as createSegments } from "./entity-segment";
import { create as createTranches } from "./entity-tranche";

export async function createDynamic(
  context: Context.Handler,
  event: Event,
  entities: CreateEntities,
  params: Params.CreateDynamic,
): Promise<Entity.Stream> {
  let stream = await createBase(context, entities, event, params);
  await context.Stream.set(stream);
  await createSegments(context, stream, params.segments);
  return stream;
}

export async function createLinear(
  context: Context.Handler,
  event: Event,
  entities: CreateEntities,
  params: Params.CreateLinear,
): Promise<Entity.Stream> {
  const baseStream = await createBase(context, entities, event, params);

  let initial: boolean = false;
  let initialAmount: bigint = 0n;
  if (params.unlockAmountStart) {
    if (params.unlockAmountStart && params.unlockAmountStart > 0n) {
      initial = true;
      initialAmount = params.unlockAmountStart;
    }
  }
  let cliff = createCliff(baseStream, params);

  const stream: Entity.Stream = {
    ...baseStream,
    ...cliff,
    initial,
    initialAmount,
  };
  await context.Stream.set(stream);
  return stream;
}

export async function createTranched(
  context: Context.Handler,
  event: Event,
  entities: CreateEntities,
  params: Params.CreateTranche,
): Promise<Entity.Stream> {
  const stream = await createBase(context, entities, event, params);
  await context.Stream.set(stream);
  await createTranches(context, stream, params.tranches);
  return stream;
}

export async function getOrThrow(
  context: Context.Loader,
  event: Event,
  tokenId: bigint | string,
): Promise<Entity.Stream> {
  const id = Id.stream(event.srcAddress, event.chainId, tokenId);
  const stream = await context.Stream.get(id);
  if (!stream) {
    throw new Error(`Stream not loaded from the entity store: ${id}`);
  }
  return stream;
}

/* -------------------------------------------------------------------------- */
/*                                  INTERNAL                                  */
/* -------------------------------------------------------------------------- */

async function createBase(
  context: Context.Handler,
  entities: CreateEntities,
  event: Event,
  params: Params.CreateCommon,
): Promise<Entity.Stream> {
  const { asset, batch, batcher, watcher } = entities;

  const now = BigInt(event.block.timestamp);
  const streamId = Id.stream(event.srcAddress, event.chainId, params.tokenId);
  const lockup = getContract("lockup", event.chainId, event.srcAddress);

  /* --------------------------------- STREAM --------------------------------- */
  // Some fields are set to 0/ undefined because they are set later depending on the stream category.
  const stream: Entity.Stream = {
    alias: Id.streamAlias(lockup.alias, event.chainId, params.tokenId),
    asset_id: asset.id,
    assetDecimals: asset.decimals,
    batch_id: batch.id,
    cancelable: params.cancelable,
    canceled: false,
    canceledAction_id: undefined,
    canceledTime: undefined,
    category: params.category as EnvioEnum.StreamCategory,
    chainId: BigInt(event.chainId),
    cliff: false,
    cliffAmount: 0n,
    cliffTime: 0n,
    contract: event.srcAddress,
    depositAmount: 0n,
    duration: 0n,
    endTime: 0n,
    funder: event.transaction.from?.toLowerCase() || "",
    hash: event.transaction.hash,
    id: streamId,
    initial: false,
    initialAmount: 0n,
    intactAmount: 0n,
    parties: [params.recipient.toLowerCase(), params.sender.toLowerCase()],
    position: batch.size,
    proxender: undefined,
    proxied: false,
    recipient: params.recipient.toLowerCase(),
    renounceAction_id: undefined,
    renounceTime: undefined,
    sender: params.sender.toLowerCase(),
    shape: params.shape,
    startTime: now,
    subgraphId: BigInt(watcher.streamCounter),
    timestamp: now,
    tokenId: params.tokenId,
    transferable: params.transferable,
    version: lockup.version,
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

function createCliff(stream: Entity.Stream, params: Params.CreateLinear) {
  if (params.cliffTime === null) {
    return null;
  }

  // In v2.0, the cliff time is set to zero if there is no cliff.
  // See https://github.com/sablier-labs/lockup/blob/v2.0.1/src/libraries/Helpers.sol#L204-L219
  if (stream.version === Version.Lockup.V2_0) {
    if (params.cliffTime !== 0n) {
      return {
        cliff: true,
        cliffAmount: params.unlockAmountCliff,
        cliffTime: params.cliffTime,
      };
    }
  } else {
    const cliffDuration = params.cliffTime - params.startTime;
    const totalDuration = stream.duration;

    // Ditto for v1.2, but the cliff amount has to be calculated as a percentage of the deposit amount.
    // See https://github.com/sablier-labs/lockup/blob/v1.2.0/src/libraries/Helpers.sol#L157-L168
    if (stream.version === Version.Lockup.V1_2) {
      if (params.cliffTime !== 0n) {
        return {
          cliff: true,
          cliffAmount: (params.depositAmount * cliffDuration) / totalDuration,
          cliffTime: params.cliffTime,
        };
      }
    }
    // In v1.0 and v1.1, no cliff means the cliff time is equal to the start time.
    // See https://github.com/sablier-labs/lockup/blob/v1.1.2/src/libraries/Helpers.sol#L88-L103
    // See https://github.com/sablier-labs/lockup/blob/v1.0.2/src/libraries/Helpers.sol#L88-L103
    else if (stream.version === Version.Lockup.V1_0 || stream.version === Version.Lockup.V1_1) {
      if (cliffDuration !== 0n) {
        return {
          cliff: true,
          cliffAmount: (params.depositAmount * cliffDuration) / totalDuration,
          cliffTime: params.cliffTime,
        };
      }
    } else {
      throw new Error(`Unknown Lockup version: ${stream.version}`);
    }
  }
}
