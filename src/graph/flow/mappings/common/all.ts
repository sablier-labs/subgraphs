import { ADDRESS_ZERO, ONE, ZERO } from "../../../constants";
import { logError } from "../../../logger";
import { logInfo } from "../../../logger";
import { ActionParams } from "../../../params";
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
import { createEntityAction, createEntityStreamFlow, loadEntityStream, toScaled } from "../../entities";

export function handleApproval(event: EventApproval): void {
  const id = event.params.tokenId;
  const stream = loadEntityStream(id);

  if (stream == null) {
    logInfo("Stream not saved before this ERC-721 approval event: {}", [id.toHexString()]);
    return;
  }

  createEntityAction(event, "Approval", {
    addressA: event.params.owner,
    addressB: event.params.approved,
    streamId: stream.id,
  } as ActionParams);
}

export function handleApprovalForAll(event: EventApprovalForAll): void {
  createEntityAction(event, "ApprovalForAll", {
    addressA: event.params.owner,
    addressB: event.params.operator,
    amountA: event.params.approved ? ONE : ZERO,
  } as ActionParams);
}

export function handleCreateFlowStream(event: EventCreate): void {
  const stream = createEntityStreamFlow(event);
  if (stream == null) {
    return;
  }
  createEntityAction(event, "Create", {
    addressA: event.params.sender,
    addressB: event.params.recipient,
    amountA: event.params.ratePerSecond /** Scaled 18D */,
    streamId: stream.id,
  } as ActionParams);
}

export function handleAdjustFlowStream(event: EventAdjust): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Adjust event: {}", [id.toHexString()]);
    return;
  }

  const action = createEntityAction(event, "Adjust", {
    amountA: event.params.oldRatePerSecond /** Scaled 18D */,
    amountB: event.params.newRatePerSecond /** Scaled 18D */,
    streamId: stream.id,
  } as ActionParams);
  /** --------------- */

  stream.lastAdjustmentAction = action.id;

  /** --------------- */

  const timeSinceLastSnapshot = event.block.timestamp.minus(stream.lastAdjustmentTimestamp);

  const snapshotAmountScaled = stream.snapshotAmount.plus(
    stream.ratePerSecond.times(timeSinceLastSnapshot),
  ); /** Scaled 18D */

  /** The depletionTime should be recalculated only if depletion is happening in the future (meaning extra amount exists inside the stream) */

  if (stream.depletionTime.gt(event.block.timestamp)) {
    const withdrawnAmountScaled = toScaled(stream.withdrawnAmount, stream.asset); /** Scaled 18D */

    const notWithdrawnScaled = snapshotAmountScaled.minus(withdrawnAmountScaled); /** Scaled 18D */

    const availableAmountScaled = toScaled(stream.availableAmount, stream.asset); /** Scaled 18D */

    const extraAmountScaled = availableAmountScaled.minus(notWithdrawnScaled); /** Scaled 18D */

    stream.depletionTime = event.block.timestamp.plus(extraAmountScaled.div(event.params.newRatePerSecond));
  }

  stream.ratePerSecond = event.params.newRatePerSecond; /** Scaled 18D */
  stream.lastAdjustmentTimestamp = event.block.timestamp;
  stream.snapshotAmount = snapshotAmountScaled; /** Scaled 18D */
  stream.save();
}

export function handleDepositFlowStream(event: EventDeposit): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Deposit event: {}", [id.toHexString()]);
    return;
  }

  createEntityAction(event, "Deposit", {
    addressA: event.params.funder,
    amountA: event.params.amount,
    streamId: stream.id,
  } as ActionParams);

  /** --------------- */

  stream.depositedAmount = stream.depositedAmount.plus(event.params.amount);

  const availableAmount = stream.availableAmount.plus(event.params.amount);
  const availableAmountScaled = toScaled(availableAmount, stream.asset); /** Scaled 18D */

  const timeSinceLastSnapshot = event.block.timestamp.minus(stream.lastAdjustmentTimestamp);

  const snapshotAmountScaled = stream.snapshotAmount.plus(
    stream.ratePerSecond.times(timeSinceLastSnapshot),
  ); /** Scaled 18D */

  const withdrawnAmountScaled = toScaled(stream.withdrawnAmount, stream.asset); /** Scaled 18D */

  const notWithdrawnScaled = snapshotAmountScaled.minus(withdrawnAmountScaled); /** Scaled 18D */

  /** If the the stream still has debt mimic the contract behavior */

  if (availableAmountScaled.gt(notWithdrawnScaled)) {
    const extraAmountScaled = availableAmountScaled.minus(notWithdrawnScaled); /** Scaled 18D */

    if (!stream.ratePerSecond.isZero()) {
      stream.depletionTime = event.block.timestamp.plus(extraAmountScaled.div(stream.ratePerSecond));
    }
  }

  stream.availableAmount = availableAmount;
  stream.save();
}

export function handlePauseFlowStream(event: EventPause): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Pause event: {}", [id.toHexString()]);
    return;
  }

  const action = createEntityAction(event, "Pause", {
    addressA: event.params.recipient,
    addressB: event.params.sender,
    amountA: event.params.totalDebt,
    streamId: stream.id,
  } as ActionParams);

  stream.paused = true;
  stream.pausedTime = event.block.timestamp;
  stream.pausedAction = action.id;

  /** --------------- */

  /* Paused is actually an adjustment with the newRate per second equal to ZERO */

  const timeSinceLastSnapshot = event.block.timestamp.minus(stream.lastAdjustmentTimestamp);

  const snapshotAmountScaled = stream.snapshotAmount.plus(
    stream.ratePerSecond.times(timeSinceLastSnapshot),
  ); /** Scaled 18D */

  stream.lastAdjustmentAction = action.id;
  stream.lastAdjustmentTimestamp = event.block.timestamp;
  stream.snapshotAmount = snapshotAmountScaled; /** Scaled 18D */

  stream.ratePerSecond = ZERO;

  stream.save();
}

export function handleRefundFromFlowStream(event: EventRefund): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Refund event: {}", [id.toHexString()]);
    return;
  }

  createEntityAction(event, "Refund", {
    addressA: event.params.sender,
    amountA: event.params.amount,
    streamId: stream.id,
  } as ActionParams);

  /** --------------- */

  stream.refundedAmount = stream.refundedAmount.plus(event.params.amount);

  stream.availableAmount = stream.availableAmount.minus(event.params.amount);
  const availableAmountScaled = toScaled(stream.availableAmount, stream.asset); /** Scaled 18D */

  const timeSinceLastSnapshot = event.block.timestamp.minus(stream.lastAdjustmentTimestamp);

  const snapshotAmountScaled = stream.snapshotAmount.plus(
    stream.ratePerSecond.times(timeSinceLastSnapshot),
  ); /** Scaled 18D */

  const withdrawnAmountScaled = toScaled(stream.withdrawnAmount, stream.asset); /** Scaled 18D */

  const notWithdrawnScaled = snapshotAmountScaled.minus(withdrawnAmountScaled); /** Scaled 18D */

  /** If refunded all the available amount the stream start accruing now  */
  const extraAmountScaled = availableAmountScaled.minus(notWithdrawnScaled);

  if (extraAmountScaled.equals(ZERO) || stream.ratePerSecond.equals(ZERO)) {
    stream.depletionTime = event.block.timestamp;
  } else {
    stream.depletionTime = event.block.timestamp.plus(extraAmountScaled.div(stream.ratePerSecond));
  }

  stream.save();
}

export function handleRestartFlowStream(event: EventRestart): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Restart event: {}", [id.toHexString()]);
    return;
  }

  const action = createEntityAction(event, "Restart", {
    addressA: event.params.sender,
    amountA: event.params.ratePerSecond /** Scaled 18D */,
    streamId: stream.id,
  } as ActionParams);

  stream.paused = false;
  stream.pausedTime = null;
  stream.pausedAction = null;
  stream.voided = false;
  stream.voidedTime = null;
  stream.voidedAction = null;

  /** Restart is actually an adjustment */

  stream.lastAdjustmentAction = action.id;
  stream.lastAdjustmentTimestamp = event.block.timestamp;
  stream.ratePerSecond = event.params.ratePerSecond; /** Scaled 18D */

  const withdrawnAmountScaled = toScaled(stream.withdrawnAmount, stream.asset); /** Scaled 18D */

  const notWithdrawnScaled = stream.snapshotAmount.minus(withdrawnAmountScaled); /** Scaled 18D */

  const availableAmountScaled = toScaled(stream.availableAmount, stream.asset); /** Scaled 18D */

  if (availableAmountScaled.gt(notWithdrawnScaled)) {
    const extraAmountScaled = availableAmountScaled.minus(notWithdrawnScaled); /** Scaled 18D */

    stream.depletionTime = event.block.timestamp.plus(extraAmountScaled.div(stream.ratePerSecond));
  } else {
    stream.depletionTime = event.block.timestamp;
  }

  stream.save();
  action.stream = stream.id;
  action.save();
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

  createEntityAction(event, "Transfer", {
    addressA: event.params.from,
    addressB: event.params.to,
    streamId: stream.id,
  } as ActionParams);

  /** --------------- */

  stream.recipient = event.params.to;
  stream.save();
}

export function handleVoidFlowStream(event: EventVoid): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Void event: {}", [id.toHexString()]);
    return;
  }

  const action = createEntityAction(event, "Void", {
    addressA: event.params.recipient,
    addressB: event.params.sender,
    amountA: event.params.newTotalDebt,
    amountB: event.params.writtenOffDebt,
    streamId: stream.id,
  } as ActionParams);

  const timeSinceLastSnapshot = event.block.timestamp.minus(stream.lastAdjustmentTimestamp);

  const snapshotAmountScaled = stream.snapshotAmount.plus(
    stream.ratePerSecond.times(timeSinceLastSnapshot),
  ); /** Scaled 18D */

  const withdrawnAmountScaled = toScaled(stream.withdrawnAmount, stream.asset); /** Scaled 18D */

  const availableAmountScaled = toScaled(stream.availableAmount, stream.asset); /** Scaled 18D */

  const maxAvailableScaled = withdrawnAmountScaled.plus(availableAmountScaled); /** Scaled 18D */

  stream.voided = true;
  stream.paused = true;

  stream.pausedTime = event.block.timestamp;
  stream.pausedAction = action.id;
  stream.voidedTime = event.block.timestamp;
  stream.voidedAction = action.id;
  /**Void is actually an adjustment with the newRate per second equal to ZERO */
  stream.lastAdjustmentAction = action.id;
  stream.lastAdjustmentTimestamp = event.block.timestamp;

  stream.snapshotAmount = maxAvailableScaled.lt(snapshotAmountScaled)
    ? maxAvailableScaled
    : snapshotAmountScaled; /** Scaled 18D */
  stream.forgivenDebt = event.params.writtenOffDebt;
  stream.ratePerSecond = ZERO;
  stream.depletionTime = ZERO;

  stream.save();
}

export function handleWithdrawFromFlowStream(event: EventWithdraw): void {
  const id = event.params.streamId;
  const stream = loadEntityStream(id);
  if (stream == null) {
    logError("Stream not saved before this Withdraw event: {}", [id.toHexString()]);
    return;
  }

  createEntityAction(event, "Withdraw", {
    addressA: event.params.caller,
    addressB: event.params.to,
    amountA: event.params.withdrawAmount,
    streamId: stream.id,
  } as ActionParams);

  stream.availableAmount = stream.availableAmount.minus(event.params.withdrawAmount);
  stream.withdrawnAmount = stream.withdrawnAmount.plus(event.params.withdrawAmount);

  stream.save();
}
