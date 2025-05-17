import { CancelLockupStream as EventCancelV1_0 } from "../../bindings/SablierV2LockupLinear_v1_0/SablierV2LockupLinear";
import { processCancel } from "../processors";

/**
 * Handles events emitted by:
 * - SablierV2LockupLinear_v1_0
 * - SablierV2LockupDynamic_v1_0
 */
export function handleCancelLockupStream(event: EventCancelV1_0): void {
  const params = event.params;
  processCancel(event, {
    recipient: params.recipient,
    recipientAmount: params.recipientAmount,
    sender: params.sender,
    senderAmount: params.senderAmount,
    streamId: params.streamId,
  });
}
