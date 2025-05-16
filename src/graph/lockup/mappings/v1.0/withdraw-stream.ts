export * from "../common/all";
import { WithdrawFromLockupStream as EventWithdrawV1_0 } from "../../bindings/SablierV2LockupLinear_v1_0/SablierV2LockupLinear";
import { processWithdraw } from "../processors";

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
