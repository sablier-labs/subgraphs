import { logError } from "../../../common/logger";
import { ActionParams } from "../../../common/params";
import { EventWithdraw } from "../../bindings";
import { createEntityAction, loadEntityStream } from "../../entities";

export function handleWithdrawFromFlowStream(event: EventWithdraw): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this WithdrawFromFlowStream event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- Stream --------------------------------- */
  stream.availableAmount = stream.availableAmount.minus(event.params.withdrawAmount);
  stream.withdrawnAmount = stream.withdrawnAmount.plus(event.params.withdrawAmount);
  stream.save();

  /* --------------------------------- Action --------------------------------- */
  createEntityAction(event, {
    addressA: event.params.caller,
    addressB: event.params.to,
    amountA: event.params.withdrawAmount,
    category: "Withdraw",
    streamId: stream.id,
  } as ActionParams);
}
