import { Version } from "@sablier/deployments";
import type { Envio } from "../../common/bindings";
import { getContract } from "../../common/deployments";
import { Id } from "../../common/id";
import type { Context, Entity, EnvioEnum } from "../bindings";
import { fetchOrReadProxender } from "../helpers/proxy";
import type { CreateEntities, Params, Segment, Tranche } from "../helpers/types";
import { update as updateBatch } from "./entity-batch";

export async function createDynamic(
  context: Context.Handler,
  event: Envio.Event,
  entities: CreateEntities,
  params: Params.CreateStreamDynamic,
): Promise<Entity.Stream> {
  const stream = await createBase(context, entities, event, params);
  await context.Stream.set(stream);
  await createSegments(context, stream, params.segments);
  return stream;
}

export async function createLinear(
  context: Context.Handler,
  event: Envio.Event,
  entities: CreateEntities,
  params: Params.CreateStreamLinear,
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
  const cliff = createCliff(baseStream, params);

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
  event: Envio.Event,
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

/* -------------------------------------------------------------------------- */
/*                                COMMON LOGIC                                */
/* -------------------------------------------------------------------------- */

async function createBase(
  context: Context.Handler,
  entities: CreateEntities,
  event: Envio.Event,
  params: Params.CreateStreamCommon,
): Promise<Entity.Stream> {
  const { asset, batch, batcher, watcher } = entities;

  const counter = watcher.streamCounter;
  const now = BigInt(event.block.timestamp);
  const tokenId = params.tokenId;
  const streamId = Id.stream(event.srcAddress, event.chainId, tokenId);
  const lockup = getContract("lockup", event.chainId, event.srcAddress);

  /* --------------------------------- STREAM --------------------------------- */
  const funder = event.transaction.from?.toLowerCase() || "";
  const recipient = params.recipient.toLowerCase();
  const sender = params.sender.toLowerCase();
  const parties = [recipient, sender];

  // PRBProxy was only used in Lockup v1.0
  let proxender: Envio.Address | undefined;
  if (lockup.version === Version.Lockup.V1_0) {
    proxender = await fetchOrReadProxender(event.chainId, event.srcAddress, sender);
    if (proxender) {
      parties.push(proxender);
    }
  }

  // Some fields are set to 0/ undefined because they are set later depending on the stream category.
  const stream: Entity.Stream = {
    alias: Id.streamAlias(lockup.alias, event.chainId, tokenId),
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
    funder,
    hash: event.transaction.hash,
    id: streamId,
    initial: false,
    initialAmount: 0n,
    intactAmount: 0n,
    parties,
    position: batch.size,
    proxender: proxender,
    proxied: Boolean(proxender),
    recipient,
    renounceAction_id: undefined,
    renounceTime: undefined,
    sender,
    shape: params.shape,
    startTime: now,
    subgraphId: counter,
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
    streamCounter: counter + 1n,
  };
  await context.Watcher.set(updatedWatcher);

  return stream;
}

function createCliff(stream: Entity.Stream, params: Params.CreateStreamLinear) {
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

async function createSegments(context: Context.Handler, stream: Entity.Stream, segments: Segment[]): Promise<void> {
  let streamed = 0n;

  // The start time of the stream is the first segment's start time
  let previous: Segment = { amount: 0n, exponent: 0n, milestone: stream.startTime };

  for (let i = 0; i < segments.length; i++) {
    const current = segments[i];

    const id = `${stream.id}-${i.toString()}`;
    const segment: Entity.Segment = {
      amount: current.amount,
      endAmount: streamed + current.amount,
      endTime: current.milestone,
      exponent: current.exponent,
      id,
      milestone: current.milestone,
      position: BigInt(i),
      startAmount: streamed,
      startTime: previous.milestone,
      stream_id: stream.id,
    };
    await context.Segment.set(segment);

    streamed += current.amount;
    previous = current;
  }
}

async function createTranches(context: Context.Handler, stream: Entity.Stream, tranches: Tranche[]): Promise<void> {
  let streamedAmount = 0n;

  // The start time of the stream is the first tranche's start time
  let previous: Tranche = { amount: 0n, timestamp: stream.startTime };

  for (let i = 0; i < tranches.length; i++) {
    const current = tranches[i];
    const id = `${stream.id}-${i.toString()}`;
    const tranche: Entity.Tranche = {
      amount: current.amount,
      endAmount: streamedAmount + current.amount,
      endTime: current.timestamp,
      id,
      position: BigInt(i),
      startAmount: streamedAmount,
      startTime: previous.timestamp,
      stream_id: stream.id,
      timestamp: current.timestamp,
    };
    await context.Tranche.set(tranche);

    streamedAmount += tranche.endAmount;
    previous = current;
  }
}
