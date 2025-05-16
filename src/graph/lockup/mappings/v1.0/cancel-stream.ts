import { CancelLockupStream as EventCancelV1_0 } from "../../bindings/SablierV2LockupLinear_v1_0/SablierV2LockupLinear";
import { processCancel } from "../processors";

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
