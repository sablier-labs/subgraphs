import { ZERO } from "../../../common/constants";
import { logError } from "../../../common/logger";
import { ActionParams } from "../../../common/params";
import { EventVoid } from "../../bindings";
import { createEntityAction, loadEntityStream } from "../../entities";
import { scale } from "../../helpers";

export function handleVoidFlowStream(event: EventVoid): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this VoidFlowStream event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- Stream --------------------------------- */
  const elapsedTime = event.block.timestamp.minus(stream.lastAdjustmentTimestamp);
  const streamedAmount = stream.ratePerSecond.times(elapsedTime);
  const snapshotAmount = stream.snapshotAmount.plus(streamedAmount);
  const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
  const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
  const maxAvailable = withdrawnAmount.plus(availableAmount);

  stream.paused = true;
  stream.voided = true;

  const now = event.block.timestamp;
  stream.pausedTime = now;
  stream.voidedTime = now;
  stream.lastAdjustmentTimestamp = now;

  // Void is actually an adjustment with the newRate per second equal to ZERO.
  stream.depletionTime = ZERO;
  stream.forgivenDebt = event.params.writtenOffDebt;
  stream.ratePerSecond = ZERO;
  stream.snapshotAmount = maxAvailable.lt(snapshotAmount) ? maxAvailable : snapshotAmount;

  /* --------------------------------- Action --------------------------------- */
  const action = createEntityAction(event, {
    addressA: event.params.recipient,
    addressB: event.params.sender,
    amountA: event.params.newTotalDebt,
    amountB: event.params.writtenOffDebt,
    category: "Void",
    streamId: stream.id,
  } as ActionParams);
  stream.lastAdjustmentAction = action.id;
  stream.pausedAction = action.id;
  stream.voidedAction = action.id;
  stream.save();
}
