import { ZERO } from "../../../common/constants";
import { logError } from "../../../common/logger";
import { ActionParams } from "../../../common/params";
import { EventRefund } from "../../bindings";
import { createEntityAction, loadEntityStream } from "../../entities";
import { scale } from "../../helpers";

export function handleRefundFromFlowStream(event: EventRefund): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Refund event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- Stream --------------------------------- */
  stream.refundedAmount = stream.refundedAmount.plus(event.params.amount);
  stream.availableAmount = stream.availableAmount.minus(event.params.amount);

  const now = event.block.timestamp;
  const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
  const elapsedTime = now.minus(stream.lastAdjustmentTimestamp);
  const streamedAmount = stream.ratePerSecond.times(elapsedTime);
  const snapshotAmount = stream.snapshotAmount.plus(streamedAmount);
  const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
  const notWithdrawnAmount = snapshotAmount.minus(withdrawnAmount);

  // If refunded all the available amount the stream, start accruing now.
  const extraAmount = availableAmount.minus(notWithdrawnAmount);
  if (extraAmount.equals(ZERO) || stream.ratePerSecond.equals(ZERO)) {
    stream.depletionTime = now;
  } else {
    stream.depletionTime = now.plus(extraAmount.div(stream.ratePerSecond));
  }
  stream.save();

  /* --------------------------------- Action --------------------------------- */
  createEntityAction(event, {
    addressA: event.params.sender,
    amountA: event.params.amount,
    category: "Refund",
    streamId: stream.id,
  } as ActionParams);
}
