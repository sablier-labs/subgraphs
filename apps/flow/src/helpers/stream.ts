import { BigInt, dataSource, log } from "@graphprotocol/graph-ts";
import { Stream } from "../generated/types/schema";
import { CreateFlowStream as EventCreate } from "../generated/types/templates/ContractFlow/SablierFlow";
import { getChainId, one, zero } from "../constants";
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
  entity.startTime = event.block.timestamp;
  entity.depletionTime = event.block.timestamp;
  entity.transferable = event.params.transferable;
  entity.sender = event.params.sender;
  entity.recipient = event.params.recipient;
  entity.ratePerSecond = event.params.ratePerSecond;

  /** --------------- */
  entity.withdrawnAmount = zero;
  entity.availableAmount = zero;
  entity.depositedAmount = zero;
  entity.snapshotAmount = zero;
  entity.protocolFeeAmount = zero;

  /** --------------- */
  entity.paused = false;
  entity.pausedAction = null;
  entity.pausedTime = null;

  entity.voided = false;
  entity.voidedAction = null;
  entity.voidedTime = null;

  entity.lastAdjustmentAction = null;
  entity.lastAdjustmentTimestamp = event.block.timestamp;

  /** --------------- */
  let asset = getOrCreateAsset(event.params.token);
  entity.asset = asset.id;

  /** --------------- */
  let batch = getOrCreateBatch(event, event.params.sender);
  entity.batch = batch.id;
  entity.position = batch.size.minus(one);

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
