/**
 * @file Common event handlers for:
 * - Lockup v1.1
 * - Lockup v1.2
 * - Lockup v2.0
 */
import {
  CancelLockupStream as EventCancelV1_1,
  WithdrawFromLockupStream as EventWithdrawV1_1,
} from "../../bindings/SablierV2LockupLinear-v1.1/SablierV2LockupLinear";
import { processCancel, processWithdraw } from "../processors";

/**
 * Handles events emitted by all contracts with the same ABI for the `CancelLockupStream` event.
 * - SablierV2LockupLinear v1.1
 * - SablierV2LockupDynamic v1.1
 * - SablierV2LockupLinear v1.2
 * - SablierV2LockupDynamic v1.2
 * - SablierV2LockupTranched v1.2
 * - SablierLockup v2.0
 */
export function handleCancelLockupStream(event: EventCancelV1_1): void {
  // Purposefully ignoring `event.params.token`
  processCancel(event, {
    recipient: event.params.recipient,
    recipientAmount: event.params.recipientAmount,
    sender: event.params.sender,
    senderAmount: event.params.senderAmount,
    streamId: event.params.streamId,
  });
}

/**
 * Handles events emitted by all contracts with the same ABI for the `WithdrawFromLockupStream` event.
 * - SablierV2LockupLinear v1.1
 * - SablierV2LockupDynamic v1.1
 * - SablierV2LockupLinear v1.2
 * - SablierV2LockupDynamic v1.2
 * - SablierV2LockupTranched v1.2
 * - SablierLockup v2.0
 */
export function handleWithdrawFromLockupStream(event: EventWithdrawV1_1): void {
  // Purposefully ignoring `event.params.token`
  processWithdraw(event, {
    amount: event.params.amount,
    to: event.params.to,
    streamId: event.params.streamId,
  });
}
