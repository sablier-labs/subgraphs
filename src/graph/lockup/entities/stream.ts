import { BigInt as BInt, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { LOCKUP_V1_0, LOCKUP_V1_1, LOCKUP_V1_2, LOCKUP_V2_0, ONE, ZERO } from "../../constants";
import { getChainId, getContractVersion } from "../../context";
import { getStreamAlias, getStreamId } from "../../ids";
import { logError } from "../../logger";
import { EntityStream } from "../bindings";
import { CreateCommonParams, CreateDynamicParams, CreateLinearParams, CreateTranchedParams } from "../params";
import { getOrCreateEntityAsset } from "./asset";
import { getOrCreateEntityBatch } from "./batch";
import { addProxyOwner } from "./proxy";
import { addSegments } from "./segments";
import { addTranches } from "./tranches";
import { getOrCreateEntityWatcher } from "./watcher";

export function createEntityStreamDynamic(
  event: ethereum.Event,
  commonParams: CreateCommonParams,
  dynamicParams: CreateDynamicParams,
): EntityStream | null {
  let stream = createBaseEntity(event, commonParams);
  if (stream == null) {
    return null;
  }

  stream.cliff = false;
  stream = addSegments(stream, dynamicParams.segments);
  stream.save();

  return stream;
}

export function createEntityStreamLinear(
  event: ethereum.Event,
  commonParams: CreateCommonParams,
  linearParams: CreateLinearParams,
): EntityStream | null {
  let stream = createBaseEntity(event, commonParams);
  if (stream == null) {
    return null;
  }

  const unlockAmountStart = linearParams.unlockAmountStart;
  if (unlockAmountStart) {
    if (unlockAmountStart.gt(ZERO)) {
      stream.initial = true;
      stream.initialAmount = unlockAmountStart;
    } else {
      stream.initial = false;
    }
  }

  stream = addCliffLL(stream, commonParams, linearParams);
  if (stream == null) {
    return null;
  }
  stream.save();

  return stream;
}

export function createEntityStreamTranched(
  event: ethereum.Event,
  commonParams: CreateCommonParams,
  tranchedParams: CreateTranchedParams,
): EntityStream | null {
  let stream = createBaseEntity(event, commonParams);
  if (stream == null) {
    return null;
  }

  stream.cliff = false;
  stream = addTranches(stream, tranchedParams.tranches);
  stream.save();

  return stream;
}

export function loadEntityStream(tokenId: BInt): EntityStream | null {
  const id = getStreamId(tokenId);
  return EntityStream.load(id);
}

/* -------------------------------------------------------------------------- */
/*                                  INTERNAL                                  */
/* -------------------------------------------------------------------------- */

function addCliffLL(
  stream: EntityStream,
  commonParams: CreateCommonParams,
  linearParams: CreateLinearParams,
): EntityStream | null {
  if (linearParams.cliffTime === null) {
    logError("Cliff time not provided for LockupLinear stream: {}", [stream.id]);
    return null;
  }

  // In v2.0, the cliff time is set to zero if there is no cliff.
  // See https://github.com/sablier-labs/lockup/blob/v2.0.1/src/libraries/Helpers.sol#L204-L219
  if (stream.version === LOCKUP_V2_0) {
    if (!linearParams.cliffTime.isZero()) {
      stream.cliff = true;
      stream.cliffAmount = linearParams.unlockAmountCliff;
      stream.cliffTime = linearParams.cliffTime;
    }
  } else {
    const cliffDuration = linearParams.cliffTime.minus(commonParams.startTime);
    const totalDuration = stream.duration;

    // Ditto for v1.2, but the cliff amount has to be calculated as a percentage of the deposit amount.
    // See https://github.com/sablier-labs/lockup/blob/v1.2.0/src/libraries/Helpers.sol#L157-L168
    if (stream.version === LOCKUP_V1_2) {
      if (!linearParams.cliffTime.isZero()) {
        stream.cliff = true;
        stream.cliffAmount = commonParams.depositAmount.times(cliffDuration).div(totalDuration);
        stream.cliffTime = linearParams.cliffTime;
      }
    }
    // In v1.0 and v1.1, no cliff means the cliff time is equal to the start time.
    // See https://github.com/sablier-labs/lockup/blob/v1.1.2/src/libraries/Helpers.sol#L88-L103
    // See https://github.com/sablier-labs/lockup/blob/v1.0.2/src/libraries/Helpers.sol#L88-L103
    else if (stream.version === LOCKUP_V1_0 || stream.version === LOCKUP_V1_1) {
      if (!cliffDuration.isZero()) {
        stream.cliff = true;
        stream.cliffAmount = commonParams.depositAmount.times(cliffDuration).div(totalDuration);
        stream.cliffTime = linearParams.cliffTime;
      }
    } else {
      logError("Unknown Lockup version: {}", [stream.version]);
      return null;
    }
  }

  return stream;
}

function createBaseEntity(event: ethereum.Event, params: CreateCommonParams): EntityStream | null {
  const watcher = getOrCreateEntityWatcher();

  const id = getStreamId(params.tokenId);
  let stream = new EntityStream(id);

  // General properties
  stream.alias = getStreamAlias(params.tokenId);
  stream.chainId = getChainId();
  stream.contract = dataSource.address();
  stream.hash = event.transaction.hash;
  stream.subgraphId = watcher.streamIndex;
  stream.timestamp = event.block.timestamp;
  stream.version = getContractVersion();

  // Stream properties
  stream.canceled = false;
  stream.cancelable = params.cancelable;
  stream.category = params.category;
  stream.depositAmount = params.depositAmount;
  stream.duration = params.endTime.minus(params.startTime);
  stream.endTime = params.endTime;
  stream.intactAmount = params.depositAmount;
  stream.parties = [params.recipient, params.sender];
  stream.recipient = params.recipient;
  stream.sender = params.sender;
  stream.startTime = params.startTime;
  stream.tokenId = params.tokenId;
  stream.transferable = params.transferable;

  // Defaults
  stream.cliff = false;
  stream.withdrawnAmount = ZERO;

  // Relationships with other entities
  const asset = getOrCreateEntityAsset(params.asset);
  stream.asset = asset.id;

  const batch = getOrCreateEntityBatch(event, params.sender);
  stream.batch = batch.id;
  stream.position = batch.size.minus(ONE);

  stream = addProxyOwner(stream);

  watcher.streamIndex = watcher.streamIndex.plus(ONE);
  watcher.save();

  return stream;
}
