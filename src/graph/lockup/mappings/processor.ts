/**
 * @file Processors are reusable logic that is used in multiple event handlers.
 */
import { ethereum } from "@graphprotocol/graph-ts";
import { logError } from "../../common/logger";
import { CommonParams } from "../../common/types";
import { Params } from "../helpers/types";
import { Store } from "../store";

export namespace Processor {
  /* -------------------------------------------------------------------------- */
  /*                                   CANCEL                                   */
  /* -------------------------------------------------------------------------- */

  export function cancel(event: ethereum.Event, params: Params.Cancel): void {
    const id = params.streamId;
    const stream = Store.Stream.get(id);
    if (stream == null) {
      logError("Stream not saved before this CancelLockupStream event: {}", [id.toHexString()]);
      return;
    }
    const action = Store.Action.create(event, {
      addressA: params.sender,
      addressB: params.recipient,
      amountA: params.senderAmount,
      amountB: params.recipientAmount,
      category: "Cancel",
      streamId: stream.id,
    } as CommonParams.Action);

    stream.cancelable = false;
    stream.canceled = true;
    stream.canceledAction = action.id;
    stream.canceledTime = event.block.timestamp;
    stream.intactAmount = params.recipientAmount; // The only amount remaining in the stream is the recipient amount

    stream.save();
  }

  /* -------------------------------------------------------------------------- */
  /*                                  WITHDRAW                                  */
  /* -------------------------------------------------------------------------- */

  export function withdraw(event: ethereum.Event, params: Params.Withdraw): void {
    const id = params.streamId;
    const stream = Store.Stream.get(id);
    if (stream == null) {
      logError("Stream not saved before this withdraw event: {}", [id.toHexString()]);
      return;
    }

    /* --------------------------------- STREAM --------------------------------- */
    const withdrawAmount = params.amount;
    const totalWithdrawnAmount = stream.withdrawnAmount.plus(withdrawAmount);
    stream.withdrawnAmount = totalWithdrawnAmount;

    if (stream.canceledAction) {
      stream.intactAmount = stream.intactAmount.minus(withdrawAmount); // Subtract the intact amount set in the cancel action
    } else {
      stream.intactAmount = stream.depositAmount.minus(totalWithdrawnAmount);
    }
    stream.save();

    /* --------------------------------- ACTION --------------------------------- */
    Store.Action.create(event, {
      addressA: event.transaction.from,
      addressB: params.to,
      amountB: withdrawAmount,
      category: "Withdraw",
      streamId: stream.id,
    } as CommonParams.Action);
  }
}
