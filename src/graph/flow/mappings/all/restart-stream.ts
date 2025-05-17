import { logError } from "../../../common/logger";
import { ActionParams } from "../../../common/params";
import { EventRestart } from "../../bindings";
import { createEntityAction, loadEntityStream } from "../../entities";
import { scale } from "../../helpers";

export function handleRestartFlowStream(event: EventRestart): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Restart event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- STREAM --------------------------------- */

  // Restart is actually an adjustment.
  const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
  const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
  const notWithdrawnAmount = stream.snapshotAmount.minus(withdrawnAmount);

  const now = event.block.timestamp;
  let depletionTime = now;
  if (availableAmount.gt(notWithdrawnAmount)) {
    const extraAmount = availableAmount.minus(notWithdrawnAmount);
    depletionTime = now.plus(extraAmount.div(stream.ratePerSecond));
  }
  stream.depletionTime = depletionTime;
  stream.lastAdjustmentTimestamp = now;
  stream.paused = false;
  stream.pausedTime = null;
  stream.pausedAction = null;
  stream.ratePerSecond = event.params.ratePerSecond;

  /* --------------------------------- ACTION --------------------------------- */
  const action = createEntityAction(event, {
    addressA: event.params.sender,
    amountA: event.params.ratePerSecond,
    category: "Restart",
    streamId: stream.id,
  } as ActionParams);
  stream.lastAdjustmentAction = action.id;
  stream.save();
}
