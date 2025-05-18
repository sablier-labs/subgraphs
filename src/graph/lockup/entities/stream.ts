import { BigInt, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { LOCKUP_V1_0, LOCKUP_V1_1, LOCKUP_V1_2, LOCKUP_V2_0, ONE, ZERO } from "../../common/constants";
import { readChainId, readContractVersion } from "../../common/context";
import { Id } from "../../common/id";
import { logError } from "../../common/logger";
import { EntityStream } from "../bindings";
import { loadProxy } from "../helpers";
import { CreateCommonParams, CreateDynamicParams, CreateLinearParams, CreateTranchedParams } from "../params";
import { getOrCreateEntityAsset } from "./asset";
import { getOrCreateEntityBatch } from "./batch";
import { addSegments } from "./segment";
import { addTranches } from "./tranche";
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

export function loadEntityStream(tokenId: BigInt): EntityStream | null {
  const id = Id.stream(dataSource.address(), tokenId);
  return EntityStream.load(id);
}

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
  const id = Id.stream(dataSource.address(), params.tokenId);
  const stream = new EntityStream(id);

  // Watcher
  const watcher = getOrCreateEntityWatcher();
  stream.subgraphId = watcher.streamCounter;
  watcher.streamCounter = watcher.streamCounter.plus(ONE);
  watcher.save();

  // Asset
  const asset = getOrCreateEntityAsset(params.asset);
  stream.asset = asset.id;

  // Batch
  const batch = getOrCreateEntityBatch(event, params.sender);
  stream.batch = batch.id;
  stream.position = batch.size.minus(ONE);

  // Proxy
  const proxy = loadProxy(params.sender);
  if (proxy) {
    stream.parties.push(proxy);
    stream.proxied = true;
    stream.proxender = proxy;
  } else {
    stream.proxied = false;
  }

  // Stream: params
  stream.alias = Id.streamAlias(params.tokenId);
  stream.canceled = false;
  stream.cancelable = params.cancelable;
  stream.category = params.category;
  stream.chainId = readChainId();
  stream.contract = event.address;
  stream.depositAmount = params.depositAmount;
  stream.duration = params.endTime.minus(params.startTime);
  stream.endTime = params.endTime;
  stream.hash = event.transaction.hash;
  stream.intactAmount = params.depositAmount;
  stream.parties = [params.recipient, params.sender];
  stream.recipient = params.recipient;
  stream.sender = params.sender;
  stream.startTime = params.startTime;
  stream.timestamp = event.block.timestamp;
  stream.tokenId = params.tokenId;
  stream.transferable = params.transferable;
  stream.version = readContractVersion();

  // Stream: defaults
  stream.withdrawnAmount = ZERO;

  return stream;
}
