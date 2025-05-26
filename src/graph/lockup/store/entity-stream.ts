import { BigInt, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { LOCKUP_V1_0, LOCKUP_V1_1, LOCKUP_V1_2, LOCKUP_V2_0, ONE, ZERO } from "../../common/constants";
import { getContractVersion, readChainId } from "../../common/context";
import { Id } from "../../common/id";
import { logError } from "../../common/logger";
import { CommonParams } from "../../common/types";
import { EntityStream } from "../bindings";
import { loadProxender } from "../helpers";
import { Params } from "../helpers/types";
import { createAction } from "./entity-action";
import { getOrCreateAsset } from "./entity-asset";
import { getOrCreateBatch } from "./entity-batch";
import { createSegment } from "./entity-segment";
import { createTranche } from "./entity-tranche";
import { getOrCreateWatcher } from "./entity-watcher";

export function createStreamDynamic(
  event: ethereum.Event,
  commonParams: Params.CreateCommon,
  dynamicParams: Params.CreateDynamic,
): EntityStream | null {
  const stream = createBaseStream(event, commonParams);
  if (stream == null) {
    return null;
  }

  stream.cliff = false;
  stream.save();
  createSegment(stream, dynamicParams.segments);

  return stream;
}

export function createStreamLinear(
  event: ethereum.Event,
  commonParams: Params.CreateCommon,
  linearParams: Params.CreateLinear,
): EntityStream | null {
  let stream = createBaseStream(event, commonParams);
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

  stream = addCliff(stream, commonParams, linearParams);
  if (stream == null) {
    return null;
  }
  stream.save();

  return stream;
}

export function createStreamTranched(
  event: ethereum.Event,
  commonParams: Params.CreateCommon,
  tranchedParams: Params.CreateTranched,
): EntityStream | null {
  const stream = createBaseStream(event, commonParams);
  if (stream == null) {
    return null;
  }

  stream.cliff = false;
  stream.save();
  createTranche(stream, tranchedParams.tranches);

  return stream;
}

export function getStream(tokenId: BigInt): EntityStream | null {
  const id = Id.stream(dataSource.address(), tokenId);
  return EntityStream.load(id);
}

/* -------------------------------------------------------------------------- */
/*                                  INTERNAL                                  */
/* -------------------------------------------------------------------------- */

function addCliff(
  stream: EntityStream,
  commonParams: Params.CreateCommon,
  linearParams: Params.CreateLinear,
): EntityStream | null {
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

function createBaseStream(event: ethereum.Event, params: Params.CreateCommon): EntityStream | null {
  const id = Id.stream(dataSource.address(), params.tokenId);
  const stream = new EntityStream(id);

  /* --------------------------------- WATCHER -------------------------------- */
  const watcher = getOrCreateWatcher();
  stream.subgraphId = watcher.streamCounter;
  watcher.streamCounter = watcher.streamCounter.plus(ONE);
  watcher.save();

  /* ---------------------------------- ASSET --------------------------------- */
  const asset = getOrCreateAsset(params.asset);
  stream.asset = asset.id;

  /* ---------------------------------- BATCH --------------------------------- */
  const batch = getOrCreateBatch(event, params.sender);
  stream.batch = batch.id;
  stream.position = batch.size.minus(ONE);

  /* ---------------------------------- PROXY --------------------------------- */
  const contractVersion = getContractVersion();
  // PRBProxy was only used in Lockup v1.0
  stream.proxied = false;
  if (contractVersion === LOCKUP_V1_0) {
    const proxender = loadProxender(params.sender);
    if (proxender) {
      stream.parties.push(proxender);
      stream.proxied = true;
      stream.proxender = proxender;
    }
  }

  /* --------------------------------- STREAM --------------------------------- */
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
  stream.shape = params.shape;
  stream.startTime = params.startTime;
  stream.timestamp = event.block.timestamp;
  stream.tokenId = params.tokenId;
  stream.transferable = params.transferable;
  stream.version = contractVersion;
  stream.withdrawnAmount = ZERO;

  /* --------------------------------- ACTION --------------------------------- */
  const action = createAction(event, {
    addressA: params.sender,
    addressB: params.recipient,
    amountA: params.depositAmount,
    category: "Create",
    streamId: stream.id,
  } as CommonParams.Action);
  if (stream.cancelable === false) {
    stream.renounceAction = action.id;
    stream.renounceTime = event.block.timestamp;
  }

  return stream;
}
