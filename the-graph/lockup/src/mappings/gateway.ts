import { ethereum } from "@graphprotocol/graph-ts";
import {
  CreateLockupDynamicStream as EventCreateDynamic_V20,
  CreateLockupDynamicStream1 as EventCreateDynamic_V21,
  CreateLockupDynamicStream2 as EventCreateDynamic_V22,
} from "../generated/types/templates/ContractLockupDynamic/SablierLockupDynamic";
import {
  CancelLockupStream as EventCancel_V20,
  CancelLockupStream1 as EventCancel_V21_V22_V23,
  CreateLockupLinearStream as EventCreateLinear_V20,
  CreateLockupLinearStream1 as EventCreateLinear_V21,
  CreateLockupLinearStream2 as EventCreateLinear_V22,
  WithdrawFromLockupStream as EventWithdraw_V20,
  WithdrawFromLockupStream1 as EventWithdraw_V21_V22_V23,
} from "../generated/types/templates/ContractLockupLinear/SablierLockupLinear";
import {
  CreateLockupDynamicStream as EventCreateDynamic_V23,
  CreateLockupLinearStream as EventCreateLinear_V23,
  CreateLockupTranchedStream as EventCreateTranched_V23,
} from "../generated/types/templates/ContractLockupLinear/SablierLockupMerged";
import { CreateLockupTranchedStream as EventCreateTranched_V22 } from "../generated/types/templates/ContractLockupTranched/SablierLockupTranched";
import { zero } from "../constants";
import {
  toEventAddress,
  toEventBoolean,
  toEventTuple,
  toValue,
} from "../utils";
import {
  handleApproval,
  handleApprovalForAll,
  handleCancel,
  handleCreateDynamic,
  handleCreateLinear,
  handleCreateTranched,
  handleRenounce,
  handleTransfer,
  handleTransferAdmin,
  handleWithdraw,
} from "./handle-stream";

function handleCancel_V20(event: EventCancel_V20): void {
  handleCancel(event);
}

function handleCancel_V21_V22_V23(event_: EventCancel_V21_V22_V23): void {
  /** Remove asset (<V23 called "asset", >= V23 called "token" ) */
  let parameters = event_.parameters.filter(
    (value) => !["asset", "token"].includes(value.name),
  );

  let event = new EventCancel_V20(
    event_.address,
    event_.logIndex,
    event_.transactionLogIndex,
    event_.logType,
    event_.block,
    event_.transaction,
    parameters,
    event_.receipt,
  );

  handleCancel(event);
}

function handleWithdraw_V20(event: EventWithdraw_V20): void {
  handleWithdraw(event);
}

function handleWithdraw_V21_V22_V23(event_: EventWithdraw_V21_V22_V23): void {
  /** Remove asset (<V23 called "asset", >= V23 called "token" ) */
  let parameters = event_.parameters.filter(
    (value) => !["asset", "token"].includes(value.name),
  );

  let event = new EventWithdraw_V20(
    event_.address,
    event_.logIndex,
    event_.transactionLogIndex,
    event_.logType,
    event_.block,
    event_.transaction,
    parameters,
    event_.receipt,
  );

  handleWithdraw(event);
}

function handleCreateLinear_V20(event: EventCreateLinear_V20): void {
  handleCreateLinear(event);
}

function handleCreateLinear_V21(event_: EventCreateLinear_V21): void {
  /** Remove transferable, handled later in this gateway */
  let parameters_no_transferrable = event_.parameters.filter(
    (value) => value.name != "transferable",
  );

  let event = new EventCreateLinear_V20(
    event_.address,
    event_.logIndex,
    event_.transactionLogIndex,
    event_.logType,
    event_.block,
    event_.transaction,
    parameters_no_transferrable,
    event_.receipt,
  );

  let stream = handleCreateLinear(event);
  if (stream == null) {
    return;
  }

  /** Handle transferable >= V21 */
  stream.transferable = event_.params.transferable;

  stream.save();
}

function handleCreateLinear_V22(event_: EventCreateLinear_V22): void {
  let parameters_no_fee = event_.parameters;

  /** Handle amounts [deposit, protocol fee, broker fee] */
  let deposit = toValue(event_.params.amounts.deposit);
  let protocolFee = toValue(zero);
  let brokerFee = toValue(event_.params.amounts.brokerFee);

  let amounts = changetype<ethereum.Tuple>([deposit, protocolFee, brokerFee]);
  parameters_no_fee[4] = toEventTuple("amounts", amounts);

  /**
   * Handle range [start, cliff, end]
   * When cliff is zero, pass it as zero as per <V22 logic.
   */
  let parameters_no_cliff = parameters_no_fee;
  if (event_.params.timestamps.cliff.isZero()) {
    let start = toValue(event_.params.timestamps.start);
    let cliff = toValue(event_.params.timestamps.start);
    let end = toValue(event_.params.timestamps.end);

    let range = changetype<ethereum.Tuple>([start, cliff, end]);
    parameters_no_cliff[8] = toEventTuple("range", range);
  }

  /** Remove transferable, handled later in this gateway */
  let parameters_no_transferrable = parameters_no_cliff.filter(
    (value) => value.name != "transferable",
  );

  let event = new EventCreateLinear_V20(
    event_.address,
    event_.logIndex,
    event_.transactionLogIndex,
    event_.logType,
    event_.block,
    event_.transaction,
    parameters_no_transferrable,
    event_.receipt,
  );

  let stream = handleCreateLinear(event);
  if (stream == null) {
    return;
  }

  /** Handle transferable >= V21 */
  stream.transferable = event_.params.transferable;

  stream.save();
}

function handleCreateLinear_V23(event_: EventCreateLinear_V23): void {
  /** Handle amounts [deposit, protocol fee, broker fee] */
  let deposit = toValue(event_.params.commonParams.amounts.deposit);
  let protocolFee = toValue(zero);
  let brokerFee = toValue(event_.params.commonParams.amounts.brokerFee);

  let amounts = changetype<ethereum.Tuple>([deposit, protocolFee, brokerFee]);

  /**
   * Handle range [start, cliff, end]
   * Since cliff is handled later in the gateway, pass it as zero as per <V22 logic.
   */
  let start = toValue(event_.params.commonParams.timestamps.start);
  let cliff = toValue(event_.params.commonParams.timestamps.start);
  let end = toValue(event_.params.commonParams.timestamps.end);

  let range = changetype<ethereum.Tuple>([start, cliff, end]);

  /** Rebuild parameters */
  let parameters = [
    event_.parameters[0], // streamId
    toEventAddress("funder", event_.params.commonParams.funder),
    toEventAddress("sender", event_.params.commonParams.sender),
    toEventAddress("recipient", event_.params.commonParams.recipient),
    toEventTuple("amounts", amounts),
    toEventAddress("asset", event_.params.commonParams.token),
    toEventBoolean("cancelable", event_.params.commonParams.cancelable),
    toEventTuple("range", range),
    toEventAddress("broker", event_.params.commonParams.broker),
  ];

  let event = new EventCreateLinear_V20(
    event_.address,
    event_.logIndex,
    event_.transactionLogIndex,
    event_.logType,
    event_.block,
    event_.transaction,
    parameters,
    event_.receipt,
  );

  let stream = handleCreateLinear(event);
  if (stream == null) {
    return;
  }

  /** Handle cliff >= V23 */
  if (!event_.params.cliffTime.equals(zero)) {
    stream.cliff = true;
    stream.cliffAmount = event_.params.unlockAmounts.cliff;
    stream.cliffTime = event_.params.cliffTime;
  }
  if (!event_.params.unlockAmounts.start.equals(zero)) {
    stream.initial = true;
    stream.initialAmount = event_.params.unlockAmounts.start;
  }

  /** Handle shape >=V23 */
  stream.shape = event_.params.commonParams.shape;

  /** Handle transferable >= V21 */
  stream.transferable = event_.params.commonParams.transferable;

  stream.save();
}

function handleCreateDynamic_V20(event: EventCreateDynamic_V20): void {
  handleCreateDynamic(event);
}

function handleCreateDynamic_V21(event_: EventCreateDynamic_V21): void {
  /** Remove transferable, handled later in this gateway */
  let parameters_no_transferrable = event_.parameters.filter(
    (value) => value.name != "transferable",
  );

  let event = new EventCreateDynamic_V20(
    event_.address,
    event_.logIndex,
    event_.transactionLogIndex,
    event_.logType,
    event_.block,
    event_.transaction,
    parameters_no_transferrable,
    event_.receipt,
  );

  let stream = handleCreateDynamic(event);
  if (stream == null) {
    return;
  }

  /** Handle transferable >= V21 */
  stream.transferable = event_.params.transferable;

  stream.save();
}

function handleCreateDynamic_V22(event_: EventCreateDynamic_V22): void {
  let parameters_no_fee = event_.parameters;

  /** Handle amounts [deposit, protocol fee, broker fee] */
  let deposit = toValue(event_.params.amounts.deposit);
  let protocolFee = toValue(zero);
  let brokerFee = toValue(event_.params.amounts.brokerFee);

  let amounts = changetype<ethereum.Tuple>([deposit, protocolFee, brokerFee]);
  parameters_no_fee[4] = toEventTuple("amounts", amounts);

  /** Remove transferable, handled later in this gateway */
  let parameters_no_transferrable = event_.parameters.filter(
    (value) => value.name != "transferable",
  );

  let event = new EventCreateDynamic_V20(
    event_.address,
    event_.logIndex,
    event_.transactionLogIndex,
    event_.logType,
    event_.block,
    event_.transaction,
    parameters_no_transferrable,
    event_.receipt,
  );

  let stream = handleCreateDynamic(event);
  if (stream == null) {
    return;
  }

  /** Handle transferable >= V21 */
  stream.transferable = event_.params.transferable;

  stream.save();
}

function handleCreateDynamic_V23(event_: EventCreateDynamic_V23): void {
  /** Handle amounts [deposit, protocol fee, broker fee] */
  let deposit = toValue(event_.params.commonParams.amounts.deposit);
  let protocolFee = toValue(zero);
  let brokerFee = toValue(event_.params.commonParams.amounts.brokerFee);

  let amounts = changetype<ethereum.Tuple>([deposit, protocolFee, brokerFee]);

  /** Handle range [start, end] */

  let start = toValue(event_.params.commonParams.timestamps.start);
  let end = toValue(event_.params.commonParams.timestamps.end);

  let range = changetype<ethereum.Tuple>([start, end]);

  /** Rebuild parameters */
  let parameters = [
    event_.parameters[0], // streamId
    toEventAddress("funder", event_.params.commonParams.funder),
    toEventAddress("sender", event_.params.commonParams.sender),
    toEventAddress("recipient", event_.params.commonParams.recipient),
    toEventTuple("amounts", amounts),
    toEventAddress("asset", event_.params.commonParams.token),
    toEventBoolean("cancelable", event_.params.commonParams.cancelable),
    event_.parameters[2], // segments
    toEventTuple("range", range),
    toEventAddress("broker", event_.params.commonParams.broker),
  ];

  let event = new EventCreateDynamic_V20(
    event_.address,
    event_.logIndex,
    event_.transactionLogIndex,
    event_.logType,
    event_.block,
    event_.transaction,
    parameters,
    event_.receipt,
  );

  let stream = handleCreateDynamic(event);
  if (stream == null) {
    return;
  }
  /** Handle shape >=V23 */
  stream.shape = event_.params.commonParams.shape;

  /** Handle transferable >= V21 */
  stream.transferable = event_.params.commonParams.transferable;

  stream.save();
}

function handleCreateTranched_V22(event: EventCreateTranched_V22): void {
  let stream = handleCreateTranched(event);
  if (stream == null) {
    return;
  }
  /** Handle transferable >= V22, here for consistency since V22 already has it */
  stream.transferable = event.params.transferable;

  stream.save();
}

function handleCreateTranched_V23(event_: EventCreateTranched_V23): void {
  /** Handle amounts [deposit, broker fee] */
  let deposit = toValue(event_.params.commonParams.amounts.deposit);
  let brokerFee = toValue(event_.params.commonParams.amounts.brokerFee);

  let amounts = changetype<ethereum.Tuple>([deposit, brokerFee]);

  /** Handle range [start, end] */

  let start = toValue(event_.params.commonParams.timestamps.start);
  let end = toValue(event_.params.commonParams.timestamps.end);

  let timestamps = changetype<ethereum.Tuple>([start, end]);

  /** Rebuild parameters */
  let parameters = [
    event_.parameters[0], // streamId
    toEventAddress("funder", event_.params.commonParams.funder),
    toEventAddress("sender", event_.params.commonParams.sender),
    toEventAddress("recipient", event_.params.commonParams.recipient),
    toEventTuple("amounts", amounts),
    toEventAddress("asset", event_.params.commonParams.token),
    toEventBoolean("cancelable", event_.params.commonParams.cancelable),
    toEventBoolean("transferable", event_.params.commonParams.transferable),
    event_.parameters[2], // tranches
    toEventTuple("timestamps", timestamps),
    toEventAddress("broker", event_.params.commonParams.broker),
  ];

  let event = new EventCreateTranched_V22(
    event_.address,
    event_.logIndex,
    event_.transactionLogIndex,
    event_.logType,
    event_.block,
    event_.transaction,
    parameters,
    event_.receipt,
  );
  let stream = handleCreateTranched(event);
  if (stream == null) {
    return;
  }

  /** Handle shape >=V23 */
  stream.shape = event_.params.commonParams.shape;

  /** Handle transferable >= V22, here for consistency since V22 already has it */
  stream.transferable = event_.params.commonParams.transferable;

  stream.save();
}

export {
  handleApproval,
  handleApprovalForAll,
  handleCancel_V20,
  handleCancel_V21_V22_V23,
  handleCreateLinear_V20,
  handleCreateLinear_V21,
  handleCreateLinear_V22,
  handleCreateLinear_V23,
  handleCreateDynamic_V20,
  handleCreateDynamic_V21,
  handleCreateDynamic_V22,
  handleCreateDynamic_V23,
  handleCreateTranched_V22,
  handleCreateTranched_V23,
  handleRenounce,
  handleTransfer,
  handleTransferAdmin,
  handleWithdraw_V20,
  handleWithdraw_V21_V22_V23,
};
