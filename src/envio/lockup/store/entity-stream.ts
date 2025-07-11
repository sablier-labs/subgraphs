import _ from "lodash";
import { Version } from "sablier";
import type { Envio } from "../../common/bindings";
import { getContract } from "../../common/deployments";
import { sanitizeString } from "../../common/helpers";
import { Id } from "../../common/id";
import { CommonStore } from "../../common/store";
import type { Context, Entity, Enum } from "../bindings";
import type { Params, Segment, Tranche } from "../helpers/types";
import { create as createAction } from "./entity-action";
import { update as updateBatch } from "./entity-batch";

export async function createDynamic(
  context: Context.Handler,
  event: Envio.Event,
  entities: Params.CreateEntities,
  params: Params.CreateStreamDynamic,
): Promise<Entity.Stream> {
  const stream = await createBase(context, event, entities, params);
  await context.Stream.set(stream);
  await addSegments(context, stream, params.segments);
  return stream;
}

export async function createLinear(
  context: Context.Handler,
  event: Envio.Event,
  entities: Params.CreateEntities,
  params: Params.CreateStreamLinear,
): Promise<Entity.Stream> {
  const baseStream = await createBase(context, event, entities, params);

  const cliff = addCliff(baseStream, params);
  const initial = addInitial(params);
  const shape = addLinearShape(baseStream, cliff.cliff);

  const stream: Entity.Stream = {
    ...baseStream,
    ...cliff,
    ...initial,
    ...shape,
  };
  await context.Stream.set(stream);
  return stream;
}

export async function createTranched(
  context: Context.Handler,
  event: Envio.Event,
  entities: Params.CreateEntities,
  params: Params.CreateTranche,
): Promise<Entity.Stream> {
  const stream = await createBase(context, event, entities, params);
  await context.Stream.set(stream);
  await addTranches(context, stream, params.tranches);
  return stream;
}

/* -------------------------------------------------------------------------- */
/*                               INTERNAL LOGIC                               */
/* -------------------------------------------------------------------------- */

async function createBase(
  context: Context.Handler,
  event: Envio.Event,
  entities: Params.CreateEntities,
  params: Params.CreateStreamCommon,
): Promise<Entity.Stream> {
  const { asset, batch, batcher, watcher } = entities;

  const counter = watcher.streamCounter;
  const now = BigInt(event.block.timestamp);
  const tokenId = params.tokenId;
  const streamId = Id.stream(event.srcAddress, event.chainId, tokenId);
  const lockup = getContract("lockup", event.chainId, event.srcAddress);

  /* --------------------------------- STREAM --------------------------------- */
  const recipient = params.recipient.toLowerCase();
  const sender = params.sender.toLowerCase();

  // Some fields are set to 0/ undefined because they are set later depending on the stream category.
  let stream: Entity.Stream = {
    alias: Id.streamAlias(lockup.alias, event.chainId, tokenId),
    asset_id: asset.id,
    assetDecimalsValue: asset.decimals,
    batch_id: batch.id,
    cancelable: params.cancelable,
    canceled: false,
    canceledAction_id: undefined,
    canceledTime: undefined,
    category: params.category as Enum.StreamCategory,
    chainId: BigInt(event.chainId),
    cliff: undefined,
    cliffAmount: undefined,
    cliffTime: undefined,
    contract: event.srcAddress.toLowerCase(),
    depositAmount: params.depositAmount,
    duration: params.endTime - params.startTime,
    endTime: params.endTime,
    funder: params.funder.toLowerCase(),
    hash: event.transaction.hash,
    id: streamId,
    initial: undefined,
    initialAmount: undefined,
    intactAmount: params.depositAmount,
    parties: _.compact([recipient, sender, params.proxender]),
    position: batch.size,
    proxender: params.proxender,
    proxied: Boolean(params.proxender),
    recipient,
    renounceAction_id: undefined,
    renounceTime: undefined,
    sender,
    shape: params.shape ? sanitizeString(params.shape) : undefined,
    startTime: params.startTime,
    subgraphId: counter,
    timestamp: now,
    tokenId: params.tokenId,
    transferable: params.transferable,
    version: lockup.version,
    withdrawnAmount: 0n,
  };

  /* ---------------------------------- BATCH --------------------------------- */
  await updateBatch(context, event, batch, batcher);

  /* --------------------------------- ACTION --------------------------------- */
  const action = await createAction(context, event, watcher, {
    addressA: params.sender,
    addressB: params.recipient,
    amountA: params.depositAmount,
    category: "Create",
    streamId: streamId,
  });
  if (params.cancelable) {
    stream = {
      ...stream,
      renounceAction_id: action.id,
      renounceTime: now,
    };
  }

  /* --------------------------------- WATCHER -------------------------------- */
  await CommonStore.Watcher.incrementCounters(context, entities.watcher);

  return stream;
}

function addCliff(
  stream: Entity.Stream,
  params: Params.CreateStreamLinear,
): Pick<Entity.Stream, "cliff" | "cliffAmount" | "cliffTime"> {
  const defaultCliff = { cliff: false, cliffAmount: undefined, cliffTime: undefined };

  // In v2.0, the cliff time is set to zero if there is no cliff.
  // See https://github.com/sablier-labs/lockup/blob/v2.0/src/libraries/Helpers.sol#L204-L219
  if (stream.version === Version.Lockup.V2_0) {
    if (params.cliffTime !== 0n) {
      return {
        cliff: true,
        cliffAmount: params.unlockAmountCliff,
        cliffTime: params.cliffTime,
      };
    }
    return defaultCliff;
  }

  const cliffDuration = BigInt(params.cliffTime - params.startTime);
  const totalDuration = BigInt(stream.duration);

  // Ditto for v1.2, but the cliff amount has to be calculated as a percentage of the deposit amount.
  // See https://github.com/sablier-labs/lockup/blob/v1.2/src/libraries/Helpers.sol#L157-L168
  if (stream.version === Version.Lockup.V1_2) {
    if (params.cliffTime !== 0n) {
      return {
        cliff: true,
        cliffAmount: (params.depositAmount * cliffDuration) / totalDuration,
        cliffTime: params.cliffTime,
      };
    }
    return defaultCliff;
  }

  // In v1.0 and v1.1, no cliff means the cliff time is equal to the start time.
  // See https://github.com/sablier-labs/lockup/blob/v1.1/src/libraries/Helpers.sol#L88-L103
  // See https://github.com/sablier-labs/lockup/blob/v1.0/src/libraries/Helpers.sol#L88-L103
  if (stream.version === Version.Lockup.V1_0 || stream.version === Version.Lockup.V1_1) {
    if (cliffDuration !== 0n) {
      return {
        cliff: true,
        cliffAmount: (params.depositAmount * cliffDuration) / totalDuration,
        cliffTime: params.cliffTime,
      };
    }
    return defaultCliff;
  }

  throw new Error(`Unknown Lockup version: ${stream.version}`);
}

function addInitial(params: Params.CreateStreamLinear): Pick<Entity.Stream, "initial" | "initialAmount"> {
  if (params.unlockAmountStart && params.unlockAmountStart > 0n) {
    return {
      initial: true,
      initialAmount: params.unlockAmountStart,
    };
  }
  return {
    initial: false,
    initialAmount: undefined,
  };
}

/**
 * Older versions of Lockup did not have a shape field, but it can be inferred.
 * @see https://github.com/sablier-labs/interfaces/blob/30fffc0/packages/constants/src/stream/shape.ts#L12
 */
function addLinearShape(stream: Entity.Stream, cliff?: boolean): Pick<Entity.Stream, "shape"> {
  if (stream.shape) {
    return { shape: stream.shape };
  }

  // Note: <v1.2 streams didn't have the unlock shapes.
  const isV1_0 = stream.version !== Version.Lockup.V1_0;
  const isV1_1 = stream.version !== Version.Lockup.V1_1;
  const isV1_2 = stream.version !== Version.Lockup.V1_2;
  if (!isV1_0 && !isV1_1 && !isV1_2) {
    return stream;
  }

  if (cliff) {
    return { shape: "cliff" };
  } else {
    return { shape: "linear" };
  }
}

async function addSegments(context: Context.Handler, stream: Entity.Stream, segments: Segment[]): Promise<void> {
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

async function addTranches(context: Context.Handler, stream: Entity.Stream, tranches: Tranche[]): Promise<void> {
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
    };
    await context.Tranche.set(tranche);

    streamedAmount += tranche.amount;
    previous = current;
  }
}
