/**
 * @file Processors are bits of reusable logic that is used by multiple event handlers.
 */
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { logError } from "../../common/logger";
import { EntityStream } from "../bindings";
import {
  createEntityAction,
  createEntityStreamDynamic,
  createEntityStreamLinear,
  createEntityStreamTranched,
  loadEntityStream,
} from "../entities";
import { ActionParams } from "../params";
import { CreateCommonParams, CreateDynamicParams, CreateLinearParams, CreateTranchedParams } from "../params";

/* -------------------------------------------------------------------------- */
/*                                   CANCEL                                   */
/* -------------------------------------------------------------------------- */

class CancelParams {
  recipient: Address;
  recipientAmount: BigInt;
  sender: Address;
  senderAmount: BigInt;
  streamId: BigInt;
}

export function processCancel(event: ethereum.Event, params: CancelParams): void {
  const id = params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this CancelLockupStream event: {}", [id.toHexString()]);
    return;
  }
  params;
  const action = createEntityAction(event, {
    addressA: params.sender,
    addressB: params.recipient,
    amountA: params.senderAmount,
    amountB: params.recipientAmount,
    category: "Cancel",
    streamId: stream.id,
  } as ActionParams);

  stream.cancelable = false;
  stream.canceled = true;
  stream.canceledAction = action.id;
  stream.canceledTime = event.block.timestamp;
  stream.intactAmount = params.recipientAmount; // The only amount remaining in the stream is the recipient amount

  stream.save();
}

/* -------------------------------------------------------------------------- */
/*                                   CREATE                                   */
/* -------------------------------------------------------------------------- */

export function processCreateLinear(
  event: ethereum.Event,
  commonParams: CreateCommonParams,
  linearParams: CreateLinearParams,
): EntityStream | null {
  const stream = createEntityStreamLinear(event, commonParams, linearParams);
  if (stream == null) {
    return null;
  }
  return processCreate(event, commonParams, stream);
}

export function processCreateDynamic(
  event: ethereum.Event,
  commonParams: CreateCommonParams,
  dynamicParams: CreateDynamicParams,
): EntityStream | null {
  const stream = createEntityStreamDynamic(event, commonParams, dynamicParams);
  if (stream == null) {
    return null;
  }
  return processCreate(event, commonParams, stream);
}

export function processCreateTranched(
  event: ethereum.Event,
  commonParams: CreateCommonParams,
  tranchedParams: CreateTranchedParams,
): EntityStream | null {
  const stream = createEntityStreamTranched(event, commonParams, tranchedParams);
  if (stream == null) {
    return null;
  }
  return processCreate(event, commonParams, stream);
}

function processCreate(event: ethereum.Event, params: CreateCommonParams, stream: EntityStream): EntityStream {
  const action = createEntityAction(event, {
    addressA: params.sender,
    addressB: params.recipient,
    amountA: params.depositAmount,
    category: "Create",
    streamId: stream.id,
  } as ActionParams);

  if (stream.cancelable === false) {
    stream.renounceAction = action.id;
    stream.renounceTime = event.block.timestamp;
  }

  stream.save();
  return stream;
}

/* -------------------------------------------------------------------------- */
/*                                  WITHDRAW                                  */
/* -------------------------------------------------------------------------- */

class WithdrawParams {
  amount: BigInt;
  streamId: BigInt;
  to: Address;
}

export function processWithdraw(event: ethereum.Event, params: WithdrawParams): void {
  const id = params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this withdraw event: {}", [id.toHexString()]);
    return;
  }

  const amount = params.amount;
  createEntityAction(event, {
    addressA: event.transaction.from,
    addressB: params.to,
    amountB: amount,
    category: "Withdraw",
    streamId: stream.id,
  } as ActionParams);

  const withdrawn = stream.withdrawnAmount.plus(amount);
  stream.withdrawnAmount = withdrawn;

  if (stream.canceledAction) {
    stream.intactAmount = stream.intactAmount.minus(amount); // Subtract the intact amount set in the cancel action
  } else {
    stream.intactAmount = stream.depositAmount.minus(withdrawn);
  }

  stream.save();
}
