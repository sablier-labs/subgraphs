import { logError } from "../../../common/logger";
import { ActionParams } from "../../../common/params";
import { EventAdjust } from "../../bindings";
import { createEntityAction, loadEntityStream } from "../../entities";
import { scale } from "../../helpers";

export function handleAdjustFlowStream(event: EventAdjust): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this AdjustFlowStream event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- STREAM --------------------------------- */
  const now = event.block.timestamp;
  const elapsedTime = now.minus(stream.lastAdjustmentTimestamp);
  const streamedAmount = stream.ratePerSecond.times(elapsedTime);
  const snapshotAmount = stream.snapshotAmount.plus(streamedAmount);

  // The depletion time is recalculated only if the current depletion time is in the future.
  if (stream.depletionTime.gt(now)) {
    const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
    const notWithdrawn = snapshotAmount.minus(withdrawnAmount);
    const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
    const extraAmount = availableAmount.minus(notWithdrawn);
    stream.depletionTime = now.plus(extraAmount.div(event.params.newRatePerSecond));
  }

  stream.lastAdjustmentTimestamp = now;
  stream.ratePerSecond = event.params.newRatePerSecond;
  stream.snapshotAmount = snapshotAmount;

  /* --------------------------------- ACTION --------------------------------- */
  const action = createEntityAction(event, {
    amountA: event.params.oldRatePerSecond,
    amountB: event.params.newRatePerSecond,
    category: "Adjust",
    streamId: stream.id,
  } as ActionParams);
  stream.lastAdjustmentAction = action.id;
  stream.save();
}
