import { WithdrawFromLockupStream as EventWithdrawV1_1 } from "../../../bindings/SablierV2LockupLinear_v1_1/SablierV2LockupLinear";
import { processWithdraw } from "../../processors";

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
