import { ZERO } from "../../../common/constants";
import { logError } from "../../../common/logger";
import { ActionParams } from "../../../common/params";
import { EventPause } from "../../bindings";
import { createEntityAction, loadEntityStream } from "../../entities";

export function handlePauseFlowStream(event: EventPause): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Pause event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- Stream --------------------------------- */
  const now = event.block.timestamp;
  stream.paused = true;
  stream.pausedTime = now;

  // Paused is actually an adjustment with the newRate per second equal to ZERO.
  const elapsedTime = now.minus(stream.lastAdjustmentTimestamp);
  const streamedAmount = stream.ratePerSecond.times(elapsedTime);
  const snapshotAmount = stream.snapshotAmount.plus(streamedAmount);

  stream.lastAdjustmentTimestamp = now;
  stream.ratePerSecond = ZERO;
  stream.snapshotAmount = snapshotAmount;
  stream.save();

  /* --------------------------------- Action --------------------------------- */
  const action = createEntityAction(event, {
    addressA: event.params.recipient,
    addressB: event.params.sender,
    amountA: event.params.totalDebt,
    category: "Pause",
    streamId: stream.id,
  } as ActionParams);
  stream.lastAdjustmentAction = action.id;
  stream.pausedAction = action.id;
  stream.save();
}
