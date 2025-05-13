import { ADDRESS_ZERO, ONE, ZERO } from "../../../common/constants";
import { logError, logInfo } from "../../../common/logger";
import { ActionParams } from "../../../common/params";
import {
  EventAdjust,
  EventApproval,
  EventApprovalForAll,
  EventCreate,
  EventDeposit,
  EventPause,
  EventRefund,
  EventRestart,
  EventTransfer,
  EventVoid,
  EventWithdraw,
} from "../../bindings";
import { createEntityAction, createEntityStreamFlow, loadEntityStream } from "../../entities";
import { scale } from "../../helpers";

export function handleApproval(event: EventApproval): void {
  const id = event.params.tokenId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logInfo("Stream not saved before this Approval event: {}", [id.toHexString()]);
    return;
  }

  createEntityAction(event, {
    addressA: event.params.owner,
    addressB: event.params.approved,
    category: "Approval",
    streamId: stream.id,
  } as ActionParams);
}

export function handleApprovalForAll(event: EventApprovalForAll): void {
  createEntityAction(event, {
    addressA: event.params.owner,
    addressB: event.params.operator,
    amountA: event.params.approved ? ONE : ZERO,
    category: "ApprovalForAll",
  } as ActionParams);
}

export function handleCreateFlowStream(event: EventCreate): void {
  const stream = createEntityStreamFlow(event);
  createEntityAction(event, {
    addressA: event.params.sender,
    addressB: event.params.recipient,
    amountA: event.params.ratePerSecond,
    category: "Create",
    streamId: stream.id,
  } as ActionParams);
}

export function handleAdjustFlowStream(event: EventAdjust): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this AdjustFlowStream event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- Stream --------------------------------- */
  const now = event.block.timestamp;
  const elapsedTime = now.minus(stream.lastAdjustmentTimestamp);
  const snapshotAmount = stream.snapshotAmount.plus(stream.ratePerSecond.times(elapsedTime));

  // The depletion time should be recalculated only if depletion is a future event, meaning extra amount in the stream.
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

  /* --------------------------------- Action --------------------------------- */
  const action = createEntityAction(event, {
    amountA: event.params.oldRatePerSecond,
    amountB: event.params.newRatePerSecond,
    category: "Adjust",
    streamId: stream.id,
  } as ActionParams);
  stream.lastAdjustmentAction = action.id;
  stream.save();
}

export function handleDepositFlowStream(event: EventDeposit): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this DepositFlowStream event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- Stream --------------------------------- */

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

export function handleRestartFlowStream(event: EventRestart): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Restart event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- Stream --------------------------------- */
  stream.paused = false;
  stream.pausedTime = null;
  stream.pausedAction = null;

  // Restart is actually an adjustment.
  const now = event.block.timestamp;
  stream.lastAdjustmentTimestamp = now;
  stream.ratePerSecond = event.params.ratePerSecond;

  const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
  const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
  const notWithdrawnAmount = stream.snapshotAmount.minus(withdrawnAmount);

  if (availableAmount.gt(notWithdrawnAmount)) {
    const extraAmount = availableAmount.minus(notWithdrawnAmount);
    stream.depletionTime = now.plus(extraAmount.div(stream.ratePerSecond));
  } else {
    stream.depletionTime = now;
  }

  /* --------------------------------- Action --------------------------------- */
  const action = createEntityAction(event, {
    addressA: event.params.sender,
    amountA: event.params.ratePerSecond,
    category: "Restart",
    streamId: stream.id,
  } as ActionParams);
  stream.lastAdjustmentAction = action.id;
  stream.save();
}

export function handleTransfer(event: EventTransfer): void {
  // As explained in issue #18, we filter out `Transfer` events emitted by the initial mint transaction.
  if (event.params.from.equals(ADDRESS_ZERO)) {
    return;
  }

  const id = event.params.tokenId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Transfer event: {}", [id.toHexString()]);
    return;
  }

  stream.recipient = event.params.to;
  stream.save();

  /* --------------------------------- Action --------------------------------- */
  createEntityAction(event, {
    addressA: event.params.from,
    addressB: event.params.to,
    category: "Transfer",
    streamId: stream.id,
  } as ActionParams);
}

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

export function handleWithdrawFromFlowStream(event: EventWithdraw): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this WithdrawFromFlowStream event: {}", [id.toHexString()]);
    return;
  }

  /* --------------------------------- Stream --------------------------------- */
  stream.availableAmount = stream.availableAmount.minus(event.params.withdrawAmount);
  stream.withdrawnAmount = stream.withdrawnAmount.plus(event.params.withdrawAmount);
  stream.save();

  /* --------------------------------- Action --------------------------------- */
  createEntityAction(event, {
    addressA: event.params.caller,
    addressB: event.params.to,
    amountA: event.params.withdrawAmount,
    category: "Withdraw",
    streamId: stream.id,
  } as ActionParams);
}
