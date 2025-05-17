import { CancelLockupStream as EventCancelV1_1 } from "../../bindings/SablierV2LockupLinear_v1_1/SablierV2LockupLinear";
import { processCancel } from "../processors";

/**
 * Handles events emitted by all contracts with the same ABI for the `CancelLockupStream` event.
 * - SablierV2LockupLinear_v1_1
 * - SablierV2LockupDynamic_v1_1
 * - SablierV2LockupLinear_v1_2
 * - SablierV2LockupDynamic_v1_2
 * - SablierV2LockupTranched_v1_2
 * - SablierLockup_v2_0
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
