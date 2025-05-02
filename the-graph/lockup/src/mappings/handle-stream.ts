import { dataSource, log } from "@graphprotocol/graph-ts";
import { ADDRESS_ZERO, one, zero } from "../constants";
import type { Stream } from "../generated/types/schema";
import type { CreateLockupDynamicStream as EventCreateDynamic } from "../generated/types/templates/ContractLockupDynamic/SablierLockupDynamic";
import type {
  Approval as EventApproval,
  ApprovalForAll as EventApprovalForAll,
  CancelLockupStream as EventCancel,
  RenounceLockupStream as EventRenounce,
  Transfer as EventTransfer,
  TransferAdmin as EventTransferAdmin,
  WithdrawFromLockupStream as EventWithdraw,
} from "../generated/types/templates/ContractLockupLinear/SablierLockupLinear";
import type { CreateLockupLinearStream as EventCreateLinear } from "../generated/types/templates/ContractLockupLinear/SablierLockupLinear";
import type { CreateLockupTranchedStream as EventCreateTranched } from "../generated/types/templates/ContractLockupTranched/SablierLockupTranched";
import { createAction, getContractByAddress, getStreamByIdFromSource } from "../helpers";
import { createDynamicStream, createLinearStream, createTranchedStream } from "../helpers/stream";

export function handleCreateLinear(event: EventCreateLinear): Stream | null {
  const stream = createLinearStream(event);
  if (stream == null) {
    return null;
  }

  const action = createAction(event);
  action.category = "Create";
  action.addressA = event.params.sender;
  action.addressB = event.params.recipient;
  action.amountA = event.params.amounts.deposit;

  if (stream.cancelable === false) {
    stream.renounceAction = action.id;
    stream.renounceTime = event.block.timestamp;
  }
  stream.save();
  action.stream = stream.id;
  action.save();

  return stream;
}

export function handleCreateDynamic(event: EventCreateDynamic): Stream | null {
  const stream = createDynamicStream(event);
  if (stream == null) {
    return null;
  }

  const action = createAction(event);
  action.category = "Create";
  action.addressA = event.params.sender;
  action.addressB = event.params.recipient;
  action.amountA = event.params.amounts.deposit;

  if (stream.cancelable === false) {
    stream.renounceAction = action.id;
    stream.renounceTime = event.block.timestamp;
  }

  stream.save();
  action.stream = stream.id;
  action.save();

  return stream;
}

export function handleCreateTranched(event: EventCreateTranched): Stream | null {
  const stream = createTranchedStream(event);
  if (stream == null) {
    return null;
  }

  const action = createAction(event);
  action.category = "Create";
  action.addressA = event.params.sender;
  action.addressB = event.params.recipient;
  action.amountA = event.params.amounts.deposit;

  if (stream.cancelable === false) {
    stream.renounceAction = action.id;
    stream.renounceTime = event.block.timestamp;
  }

  stream.save();
  action.stream = stream.id;
  action.save();

  return stream;
}

export function handleCancel(event: EventCancel): void {
  const id = event.params.streamId;
  const stream = getStreamByIdFromSource(id);
  if (stream == null) {
    log.info("[SABLIER] Stream hasn't been registered before this cancel event: {}", [id.toHexString()]);
    log.error("[SABLIER]", []);
    return;
  }

  const action = createAction(event);
  action.category = "Cancel";
  action.addressA = event.params.sender;
  action.addressB = event.params.recipient;
  action.amountA = event.params.senderAmount;
  action.amountB = event.params.recipientAmount;
  /** --------------- */

  stream.cancelable = false;
  stream.canceled = true;
  stream.canceledAction = action.id;
  stream.canceledTime = event.block.timestamp;
  stream.intactAmount = event.params.recipientAmount; // The only amount remaining in the stream is the non-withdrawn recipient amount

  stream.save();
  action.stream = stream.id;
  action.save();
}

export function handleRenounce(event: EventRenounce): void {
  const id = event.params.streamId;
  const stream = getStreamByIdFromSource(id);

  if (stream == null) {
    return;
  }

  const action = createAction(event);
  action.category = "Renounce";

  /** --------------- */
  stream.cancelable = false;
  stream.renounceAction = action.id;
  stream.renounceTime = event.block.timestamp;

  stream.save();
  action.stream = stream.id;
  action.save();
}

export function handleTransfer(event: EventTransfer): void {
  /**
   * As described in issue #18, we will first filter out
   * any `Transfer` events emitted by the initial mint transaction
   */

  if (event.params.from.equals(ADDRESS_ZERO)) {
    return;
  }

  /** --------------- */

  const id = event.params.tokenId;
  const stream = getStreamByIdFromSource(id);
  if (stream == null) {
    log.info("[SABLIER] Stream hasn't been registered before this transfer event: {}", [id.toHexString()]);
    log.error("[SABLIER]", []);
    return;
  }

  const action = createAction(event);
  action.category = "Transfer";

  action.addressA = event.params.from;
  action.addressB = event.params.to;

  /** --------------- */

  stream.recipient = event.params.to;
  const parties = [stream.sender, event.params.to];

  if (stream.proxied === true) {
    /** Without explicit copies, AssemblyScript will crash (i.e. don't use stream.proxender directly) */
    const proxender = stream.proxender;
    if (proxender !== null) {
      parties.push(proxender);
    }
  }

  stream.parties = parties;

  stream.save();
  action.stream = stream.id;
  action.save();
}

export function handleWithdraw(event: EventWithdraw): void {
  const id = event.params.streamId;
  const stream = getStreamByIdFromSource(id);
  if (stream == null) {
    log.info("[SABLIER] Stream hasn't been registered before this withdraw event: {}", [id.toHexString()]);
    log.error("[SABLIER]", []);
    return;
  }

  const action = createAction(event);
  action.category = "Withdraw";
  action.addressA = event.transaction.from;
  action.addressB = event.params.to;
  action.amountB = event.params.amount;

  /** --------------- */
  const amount = event.params.amount;
  const withdrawn = stream.withdrawnAmount.plus(amount);
  stream.withdrawnAmount = withdrawn;

  if (stream.canceledAction) {
    stream.intactAmount = stream.intactAmount.minus(amount); // The intact amount (recipient) has been set in the cancel action, now subtract
  } else {
    stream.intactAmount = stream.depositAmount.minus(withdrawn);
  }

  stream.save();
  action.stream = stream.id;
  action.save();
}

export function handleApproval(event: EventApproval): void {
  const id = event.params.tokenId;
  const stream = getStreamByIdFromSource(id);

  if (stream == null) {
    log.info("[SABLIER] Stream hasn't been registered before this approval event: {}", [id.toHexString()]);
    return;
  }

  const action = createAction(event);
  action.category = "Approval";

  action.addressA = event.params.owner;
  action.addressB = event.params.approved;

  /** --------------- */

  action.stream = stream.id;
  action.save();
}
export function handleApprovalForAll(event: EventApprovalForAll): void {
  const action = createAction(event);
  action.category = "ApprovalForAll";

  action.addressA = event.params.owner;
  action.addressB = event.params.operator;
  action.amountA = event.params.approved ? one : zero;

  /** --------------- */

  action.save();
}

/**
 * Use the TransferAdmin event as an `onCreate` lifecycle step
 * as it's the first one to be logged after the contract's creation
 */
export function handleTransferAdmin(event: EventTransferAdmin): void {
  const contract = getContractByAddress(dataSource.address());
  if (contract == null) {
    log.info("[SABLIER] Contract hasn't been registered before this transfer admin event: {}", [
      dataSource.address().toHexString(),
    ]);
    log.error("[SABLIER]", []);
    return;
  }

  contract.admin = event.params.newAdmin;
  contract.save();
}
