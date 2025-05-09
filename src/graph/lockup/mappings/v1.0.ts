export * from "./common/all";

import { CreateLockupDynamicStream as EventCreateDynamicV1_0 } from "../bindings/SablierV2LockupDynamic-v1.0/SablierV2LockupDynamic";
import {
  CancelLockupStream as EventCancelV1_0,
  CreateLockupLinearStream as EventCreateLinearV1_0,
  WithdrawFromLockupStream as EventWithdrawV1_0,
} from "../bindings/SablierV2LockupLinear-v1.0/SablierV2LockupLinear";
import { convertSegmentsV1_0 } from "../convertors";
import { processCancel, processCreateDynamic, processCreateLinear, processWithdraw } from "./processors";

/**
 * Handles events emitted by:
 * - SablierV2LockupLinear
 * - SablierV2LockupDynamic
 */
export function handleCancelLockupStream(event: EventCancelV1_0): void {
  processCancel(event, {
    recipient: event.params.recipient,
    recipientAmount: event.params.recipientAmount,
    sender: event.params.sender,
    senderAmount: event.params.senderAmount,
    streamId: event.params.streamId,
  });
}

/**
 * Handles events emitted by:
 * - SablierV2LockupLinear
 */
export function handleCreateLockupLinearStream(event: EventCreateLinearV1_0): void {
  processCreateLinear(
    event,
    {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: "LockupLinear",
      depositAmount: event.params.amounts.deposit,
      endTime: event.params.range.end,
      funder: event.params.funder,
      recipient: event.params.recipient,
      sender: event.params.sender,
      startTime: event.params.range.start,
      tokenId: event.params.streamId,
      transferable: true,
    },
    {
      cliffTime: event.params.range.cliff,
      unlockAmountCliff: null,
      unlockAmountStart: null,
    },
  );
}

/**
 * Handles events emitted by:
 * - SablierV2LockupDynamic
 */
export function handleCreateLockupDynamicStream(event: EventCreateDynamicV1_0): void {
  processCreateDynamic(
    event,
    {
      asset: event.params.asset,
      cancelable: event.params.cancelable,
      category: "LockupDynamic",
      depositAmount: event.params.amounts.deposit,
      endTime: event.params.range.end,
      funder: event.params.funder,
      recipient: event.params.recipient,
      sender: event.params.sender,
      startTime: event.params.range.start,
      tokenId: event.params.streamId,
      transferable: true,
    },
    {
      segments: convertSegmentsV1_0(event.params.segments),
    },
  );
}

/**
 * Handles events emitted by:
 * - SablierV2LockupLinear
 * - SablierV2LockupDynamic
 */
export function handleWithdrawFromLockupStream(event: EventWithdrawV1_0): void {
  processWithdraw(event, {
    amount: event.params.amount,
    streamId: event.params.streamId,
    to: event.params.to,
  });
}
