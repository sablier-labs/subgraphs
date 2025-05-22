import { ZERO } from "../../../common/constants";
import { logError } from "../../../common/logger";
import { CommonParams } from "../../../common/types";
import { EventVoid } from "../../bindings";
import { scale } from "../../helpers";
import { Store } from "../../store";

export function handleVoidFlowStream(event: EventVoid): void {
  const id = event.params.streamId;
  const stream = Store.Stream.get(id);
  if (stream == null) {
    logError("Stream not saved before this VoidFlowStream event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- STREAM --------------------------------- */

  // Void is actually an adjustment with the new rate set to zero.
  const now = event.block.timestamp;
  const elapsedTime = now.minus(stream.lastAdjustmentTimestamp);
  const streamedAmount = stream.ratePerSecond.times(elapsedTime);
  const snapshotAmount = stream.snapshotAmount.plus(streamedAmount);

  const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
  const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
  const maxAvailable = withdrawnAmount.plus(availableAmount);

  stream.depletionTime = ZERO;
  stream.forgivenDebt = event.params.writtenOffDebt;
  stream.lastAdjustmentTimestamp = now;
  stream.paused = true;
  stream.pausedTime = now;
  stream.ratePerSecond = ZERO;
  stream.snapshotAmount = maxAvailable.lt(snapshotAmount) ? maxAvailable : snapshotAmount;
  stream.voidedTime = now;
  stream.voided = true;

  /* --------------------------------- ACTION --------------------------------- */
  const action = Store.Action.create(event, {
    addressA: event.params.recipient,
    addressB: event.params.sender,
    amountA: event.params.newTotalDebt,
    amountB: event.params.writtenOffDebt,
    category: "Void",
    streamId: stream.id,
  } as CommonParams.Action);
  stream.lastAdjustmentAction = action.id;
  stream.pausedAction = action.id;
  stream.voidedAction = action.id;
  stream.save();
}
