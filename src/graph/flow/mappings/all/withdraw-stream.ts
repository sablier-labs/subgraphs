import { logError } from "../../../common/logger";
import { ActionParams } from "../../../common/types";
import { EventWithdraw } from "../../bindings";
import { Store } from "../../store";

export function handleWithdrawFromFlowStream(event: EventWithdraw): void {
  const id = event.params.streamId;
  const stream = Store.Stream.get(id);
  if (stream == null) {
    logError("Stream not saved before this WithdrawFromFlowStream event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- STREAM --------------------------------- */
  stream.availableAmount = stream.availableAmount.minus(event.params.withdrawAmount);
  stream.withdrawnAmount = stream.withdrawnAmount.plus(event.params.withdrawAmount);
  stream.save();

  /* --------------------------------- ACTION --------------------------------- */
  Store.Action.create(event, {
    addressA: event.params.caller,
    addressB: event.params.to,
    amountA: event.params.withdrawAmount,
    category: "Withdraw",
    streamId: stream.id,
  } as ActionParams);
}
