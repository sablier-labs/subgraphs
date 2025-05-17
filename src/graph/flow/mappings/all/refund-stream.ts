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

  /* --------------------------------- STREAM --------------------------------- */
  stream.refundedAmount = stream.refundedAmount.plus(event.params.amount);
  stream.availableAmount = stream.availableAmount.minus(event.params.amount);

  const now = event.block.timestamp;
  const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
  const elapsedTime = now.minus(stream.lastAdjustmentTimestamp);
  const streamedAmount = stream.ratePerSecond.times(elapsedTime);
  const snapshotAmount = stream.snapshotAmount.plus(streamedAmount);
  const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
  const notWithdrawnAmount = snapshotAmount.minus(withdrawnAmount);

  // If the entire available amount is refunded, the stream starts accruing now.
  const extraAmount = availableAmount.minus(notWithdrawnAmount);
  const depletionTime = now;
  if (extraAmount.notEqual(ZERO) || stream.ratePerSecond.notEqual(ZERO)) {
    stream.depletionTime = now.plus(extraAmount.div(stream.ratePerSecond));
  }
  stream.depletionTime = depletionTime;
  stream.save();

  /* --------------------------------- ACTION --------------------------------- */
  createEntityAction(event, {
    addressA: event.params.sender,
    amountA: event.params.amount,
    category: "Refund",
    streamId: stream.id,
  } as ActionParams);
}
