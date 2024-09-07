import { BigInt, dataSource, ethereum, log } from "@graphprotocol/graph-ts";
import { Stream } from "../generated/types/schema";
import { CreateFlowStream as EventCreate } from "../generated/types/templates/ContractFlow/SablierFlow";
import {
  StreamVersion_V20,
  StreamVersion_V21,
  getChainId,
  one,
  zero,
} from "../constants";
import { getOrCreateAsset } from "./asset";
import { getOrCreateBatch } from "./batch";
import { getContractByAddress } from "./contract";
import { getOrCreateWatcher } from "./watcher";

export function createStream(event: EventCreate): Stream | null {
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

  let tokenId = event.params.streamId;

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

  entity.transferable = event.params.transferable;
  entity.withdrawnAmount = zero;

  entity.sender = event.params.sender;
  entity.recipient = event.params.recipient;

  /** --------------- */
  let asset = getOrCreateAsset(event.params.token);
  entity.asset = asset.id;

  /** --------------- */
  let batch = getOrCreateBatch(event, event.params.sender);
  entity.batch = batch.id;
  entity.position = batch.size.minus(one);

  // /** --------------- */
  // let id = generateStreamId(tokenId);
  // if (id == null) {
  //   return null;
  // }

  // let alias = generateStreamAlias(tokenId);

  // let entity = createStream(tokenId, event);

  // if (entity == null) {
  //   return null;
  // }

  // let contract = getContractByAddress(dataSource.address());
  // if (contract == null) {
  //   log.info(
  //     "[SABLIER] Contract hasn't been registered before this create event: {}",
  //     [dataSource.address().toHexString()],
  //   );
  //   log.error("[SABLIER]", []);
  //   return null;
  // }

  // /** --------------- */
  // entity.category = "LockupLinear";
  // entity.funder = event.params.funder;
  // entity.sender = event.params.sender;
  // entity.recipient = event.params.recipient;
  // entity.parties = [event.params.sender, event.params.recipient];

  // entity.depositAmount = event.params.amounts.deposit;
  // entity.brokerFeeAmount = event.params.amounts.brokerFee;
  // entity.protocolFeeAmount = event.params.amounts.protocolFee;
  // entity.intactAmount = event.params.amounts.deposit;

  // entity.startTime = event.params.range.start;
  // entity.endTime = event.params.range.end;
  // entity.cancelable = event.params.cancelable;

  // /** --------------- */
  // let deposit = event.params.amounts.deposit;
  // let duration = event.params.range.end.minus(event.params.range.start);

  // /** --------------- */
  // let cliff = event.params.range.cliff.minus(event.params.range.start);

  // /** String comparisons will not work with "===", loose operators are required */
  // if (
  //   contract.version != StreamVersion_V21 &&
  //   contract.version != StreamVersion_V20
  // ) {
  //   /** StreamVersion_V22 introduced zero cliffs for linear streams */
  //   if (event.params.range.cliff.isZero()) {
  //     cliff = zero;
  //   }
  // }

  // if (!cliff.isZero()) {
  //   entity.cliff = true;
  //   entity.cliffAmount = deposit.times(cliff).div(duration);
  //   entity.cliffTime = event.params.range.cliff;
  // } else {
  //   entity.cliff = false;
  // }

  // /** --------------- */
  // let asset = getOrCreateAsset(event.params.asset);
  // entity.asset = asset.id;

  // /** --------------- */
  // let batch = getOrCreateBatch(event, event.params.sender);
  // entity.batch = batch.id;
  // entity.position = batch.size.minus(one);
  watcher.streamIndex = watcher.streamIndex.plus(one);
  watcher.save();

  entity.save();
  return entity;
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
