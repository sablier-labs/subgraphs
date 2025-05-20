import { WithdrawFromLockupStream as EventWithdrawV1_0 } from "../../bindings/SablierV2LockupLinear_v1_0/SablierV2LockupLinear";
import { Processor } from "../processor";

/**
 * Handles events emitted by:
 * - SablierV2LockupLinear_v1_0
 * - SablierV2LockupDynamic_v1_0
 */
export function handleWithdrawFromLockupStream(event: EventWithdrawV1_0): void {
  const params = event.params;
  Processor.withdraw(event, {
    amount: params.amount,
    streamId: params.streamId,
    to: params.to,
  });
}
