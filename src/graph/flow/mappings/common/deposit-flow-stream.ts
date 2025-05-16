import { logError } from "../../../common/logger";
import { ActionParams } from "../../../common/params";
import { EventDeposit } from "../../bindings";
import { createEntityAction, loadEntityStream } from "../../entities";
import { scale } from "../../helpers";

export function handleDepositFlowStream(event: EventDeposit): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this DepositFlowStream event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- Stream --------------------------------- */
  stream.depositedAmount = stream.depositedAmount.plus(event.params.amount);
  stream.availableAmount = stream.availableAmount.plus(event.params.amount);

  const now = event.block.timestamp;
  const availableAmount = scale(stream.availableAmount, stream.assetDecimals);

  const elapsedTime = now.minus(stream.lastAdjustmentTimestamp);
  const snapshotAmount = stream.snapshotAmount.plus(stream.ratePerSecond.times(elapsedTime));
  const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
  const notWithdrawnAmount = snapshotAmount.minus(withdrawnAmount);

  // If the stream still has debt, mimic the contract behavior.
  if (availableAmount.gt(notWithdrawnAmount)) {
    const extraAmount = availableAmount.minus(notWithdrawnAmount);

    if (stream.ratePerSecond.isZero() === false) {
      stream.depletionTime = now.plus(extraAmount.div(stream.ratePerSecond));
    }
  }
  stream.save();

  /* --------------------------------- Action --------------------------------- */
  createEntityAction(event, {
    addressA: event.params.funder,
    amountA: event.params.amount,
    category: "Deposit",
    streamId: stream.id,
  } as ActionParams);
}
