import { BigInt, dataSource, ethereum, log } from "@graphprotocol/graph-ts";
import { Stream } from "../generated/types/schema";
import { CreateLockupDynamicStream as EventCreateDynamic } from "../generated/types/templates/ContractLockupDynamic/SablierLockupDynamic";
import { CreateLockupLinearStream as EventCreateLinear } from "../generated/types/templates/ContractLockupLinear/SablierLockupLinear";
import { CreateLockupTranchedStream as EventCreateTranched } from "../generated/types/templates/ContractLockupTranched/SablierLockupTranched";
import { getChainId, one, zero } from "../constants";
import { getOrCreateAsset } from "./asset";
import { getOrCreateBatch } from "./batch";
import { getContractByAddress } from "./contract";
import { bindProxyOwner } from "./proxy";
import { createSegments } from "./segments";
import { createTranches } from "./tranches";
import { getOrCreateWatcher } from "./watcher";

function createStream(tokenId: BigInt, event: ethereum.Event): Stream | null {
  let watcher = getOrCreateWatcher();
  let contract = getContractByAddress(dataSource.address());
  if (contract == null) {
    log.info(
      "[SABLIER] Contract hasn't been registered before this create event: {}",
      [dataSource.address().toHexString()],
    );
    log.error("[SABLIER]", []);
    return null;
  }

  /** --------------- */
  let id = generateStreamId(tokenId);
  if (id == null) {
    return null;
  }

  let alias = generateStreamAlias(tokenId);

  /** --------------- */
  let entity = new Stream(id);
  /** --------------- */
  entity.tokenId = tokenId;
  entity.alias = alias;
  entity.contract = contract.id;
  entity.version = contract.version;
  entity.subgraphId = watcher.streamIndex;
  entity.hash = event.transaction.hash;
  entity.timestamp = event.block.timestamp;
  entity.chainId = getChainId();

  /** --------------- */
  entity.cliff = false;
  entity.initial = false;
  entity.proxied = false;
  entity.canceled = false;
  entity.renounceAction = null;
  entity.canceledAction = null;
  entity.initialAmount = null;
  entity.cliffAmount = null;
  entity.cliffTime = null;
  entity.transferable = true;
  entity.withdrawnAmount = zero;

  /** --------------- */
  watcher.streamIndex = watcher.streamIndex.plus(one);
  watcher.save();

  /** --------------- */

  return entity;
}

export function createLinearStream(event: EventCreateLinear): Stream | null {
  let tokenId = event.params.streamId;
  let entity = createStream(tokenId, event);

  if (entity == null) {
    return null;
  }

  let contract = getContractByAddress(dataSource.address());
  if (contract == null) {
    log.info(
      "[SABLIER] Contract hasn't been registered before this create event: {}",
      [dataSource.address().toHexString()],
    );
    log.error("[SABLIER]", []);
    return null;
  }

  /** --------------- */
  entity.category = "LockupLinear";
  entity.funder = event.params.funder;
  entity.sender = event.params.sender;
  entity.recipient = event.params.recipient;
  entity.parties = [event.params.sender, event.params.recipient];

  entity.depositAmount = event.params.amounts.deposit;
  entity.brokerFeeAmount = event.params.amounts.brokerFee;
  entity.protocolFeeAmount = event.params.amounts.protocolFee;
  entity.intactAmount = event.params.amounts.deposit;

  entity.startTime = event.params.range.start;
  entity.endTime = event.params.range.end;
  entity.cancelable = event.params.cancelable;

  /** --------------- */
  let deposit = event.params.amounts.deposit;
  let duration = event.params.range.end.minus(event.params.range.start);

  /** --------------- */
  let cliff = event.params.range.cliff.minus(event.params.range.start);

  /** Cliff logic for <V22, anything above will be handled in the gateway */
  if (!cliff.isZero()) {
    entity.cliff = true;
    entity.cliffAmount = deposit.times(cliff).div(duration);
    entity.cliffTime = event.params.range.cliff;
  } else {
    entity.cliff = false;
  }

  entity.duration = duration;

  /** --------------- */
  let asset = getOrCreateAsset(event.params.asset);
  entity.asset = asset.id;

  /** --------------- */
  let batch = getOrCreateBatch(event, event.params.sender);
  entity.batch = batch.id;
  entity.position = batch.size.minus(one);

  /** --------------- */
  let resolved = bindProxyOwner(entity);

  resolved.save();
  return resolved;
}

export function createDynamicStream(event: EventCreateDynamic): Stream | null {
  let tokenId = event.params.streamId;
  let entity = createStream(tokenId, event);

  if (entity == null) {
    return null;
  }

  /** --------------- */
  entity.category = "LockupDynamic";
  entity.funder = event.params.funder;
  entity.sender = event.params.sender;
  entity.recipient = event.params.recipient;
  entity.parties = [event.params.sender, event.params.recipient];

  entity.depositAmount = event.params.amounts.deposit;
  entity.brokerFeeAmount = event.params.amounts.brokerFee;
  entity.protocolFeeAmount = event.params.amounts.protocolFee;
  entity.intactAmount = event.params.amounts.deposit;

  entity.startTime = event.params.range.start;
  entity.endTime = event.params.range.end;
  entity.cancelable = event.params.cancelable;
  entity.cliff = false;

  entity.duration = event.params.range.end.minus(event.params.range.start);

  /** --------------- */
  let asset = getOrCreateAsset(event.params.asset);
  entity.asset = asset.id;

  /** --------------- */
  let batch = getOrCreateBatch(event, event.params.sender);
  entity.batch = batch.id;
  entity.position = batch.size.minus(one);

  /** --------------- */
  entity.save();

  /** --------------- */
  entity = createSegments(entity, event);

  /** --------------- */
  let resolved = bindProxyOwner(entity);

  resolved.save();
  return resolved;
}

export function createTranchedStream(
  event: EventCreateTranched,
): Stream | null {
  let tokenId = event.params.streamId;
  let entity = createStream(tokenId, event);

  if (entity == null) {
    return null;
  }

  /** --------------- */
  entity.category = "LockupTranched";
  entity.funder = event.params.funder;
  entity.sender = event.params.sender;
  entity.recipient = event.params.recipient;
  entity.parties = [event.params.sender, event.params.recipient];

  entity.depositAmount = event.params.amounts.deposit;
  entity.brokerFeeAmount = event.params.amounts.brokerFee;
  entity.protocolFeeAmount = zero;
  entity.intactAmount = event.params.amounts.deposit;

  entity.startTime = event.params.timestamps.start;
  entity.endTime = event.params.timestamps.end;
  entity.cancelable = event.params.cancelable;
  entity.cliff = false;

  entity.duration = event.params.timestamps.end.minus(
    event.params.timestamps.start,
  );

  /** --------------- */
  let asset = getOrCreateAsset(event.params.asset);
  entity.asset = asset.id;

  /** --------------- */
  let batch = getOrCreateBatch(event, event.params.sender);
  entity.batch = batch.id;
  entity.position = batch.size.minus(one);

  /** --------------- */
  entity.save();

  /** --------------- */
  entity = createTranches(entity, event);

  /** --------------- */
  let resolved = bindProxyOwner(entity);

  resolved.save();
  return resolved;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateStreamId(tokenId: BigInt): string {
  let contract = getContractByAddress(dataSource.address());
  if (contract == null) {
    log.info(
      "[SABLIER] Contract hasn't been registered before this event: {}",
      [dataSource.address().toHexString()],
    );
    log.error("[SABLIER]", []);
    return "";
  }

  let id = ""
    .concat(contract.address.toHexString())
    .concat("-")
    .concat(getChainId().toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}

export function generateStreamAlias(tokenId: BigInt): string {
  let contract = getContractByAddress(dataSource.address());
  if (contract == null) {
    log.info(
      "[SABLIER] Contract hasn't been registered before this event: {}",
      [dataSource.address().toHexString()],
    );
    log.error("[SABLIER]", []);
    return "";
  }

  let id = contract.alias
    .concat("-")
    .concat(getChainId().toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}

export function getStreamByIdFromSource(tokenId: BigInt): Stream | null {
  let id = generateStreamId(tokenId);
  return Stream.load(id);
}
