import { WithdrawFromLockupStream as EventWithdrawV1_1 } from "../../bindings/SablierV2LockupLinear_v1_1/SablierV2LockupLinear";
import { Processor } from "../processor";

/**
 * Handles events emitted by all contracts with the same ABI for the `WithdrawFromLockupStream` event.
 * - SablierV2LockupLinear_v1_1
 * - SablierV2LockupDynamic_v1_1
 * - SablierV2LockupLinear_v1_2
 * - SablierV2LockupDynamic_v1_2
 * - SablierV2LockupTranched_v1_2
 * - SablierLockup_v2_0
 */
export function handleWithdrawFromLockupStream(event: EventWithdrawV1_1): void {
  Processor.withdraw(event, {
    amount: event.params.amount,
    streamId: event.params.streamId,
    to: event.params.to,
  });
}
