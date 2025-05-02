import { type BigInt as GraphBigInt, dataSource, log } from "@graphprotocol/graph-ts";
import { getChainId, one, zero } from "../constants";
import { Stream } from "../generated/types/schema";
import type { CreateFlowStream as EventCreate } from "../generated/types/templates/ContractFlow/SablierFlow";
import { getOrCreateAsset } from "./asset";
import { getOrCreateBatch } from "./batch";
import { getContractByAddress } from "./contract";
import { getOrCreateWatcher } from "./watcher";

export function createStream(event: EventCreate): Stream | null {
  const watcher = getOrCreateWatcher();
  const contract = getContractByAddress(dataSource.address());
  if (contract == null) {
    log.info("[SABLIER] Contract hasn't been registered before this create event: {}", [
      dataSource.address().toHexString(),
    ]);
    log.error("[SABLIER]", []);
    return null;
  }

  const tokenId = event.params.streamId;

  const id = generateStreamId(tokenId);
  if (id == null) {
    return null;
  }

  const alias = generateStreamAlias(tokenId);

  /** --------------- */
  const entity = new Stream(id);
  /** --------------- */
  entity.tokenId = tokenId;
  entity.alias = alias;
  entity.contract = contract.id;
  entity.version = contract.version;
  entity.subgraphId = watcher.streamIndex;
  entity.category = "Flow";
  entity.hash = event.transaction.hash;
  entity.timestamp = event.block.timestamp;
  entity.chainId = getChainId();
  entity.startTime = event.block.timestamp;
  entity.depletionTime = event.block.timestamp;
  entity.transferable = event.params.transferable;
  entity.creator = event.transaction.from;
  entity.sender = event.params.sender;
  entity.recipient = event.params.recipient;
  entity.ratePerSecond = event.params.ratePerSecond; /** Scaled 18D */

  /** --------------- */
  entity.refundedAmount = zero;
  entity.withdrawnAmount = zero;
  entity.availableAmount = zero;
  entity.depositedAmount = zero;
  entity.snapshotAmount = zero;
  entity.protocolFeeAmount = zero;
  entity.forgivenDebt = zero;

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
  const asset = getOrCreateAsset(event.params.token);
  entity.asset = asset.id;

  /** --------------- */
  const batch = getOrCreateBatch(event, event.params.sender);
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

export function generateStreamId(tokenId: GraphBigInt): string {
  const contract = getContractByAddress(dataSource.address());
  if (contract == null) {
    log.info("[SABLIER] Contract hasn't been registered before this event: {}", [dataSource.address().toHexString()]);
    log.error("[SABLIER]", []);
    return "";
  }

  const id = ""
    .concat(contract.address.toHexString())
    .concat("-")
    .concat(getChainId().toString())
    .concat("-")
    .concat(tokenId.toString());

  return id;
}

export function generateStreamAlias(tokenId: GraphBigInt): string {
  const contract = getContractByAddress(dataSource.address());
  if (contract == null) {
    log.info("[SABLIER] Contract hasn't been registered before this event: {}", [dataSource.address().toHexString()]);
    log.error("[SABLIER]", []);
    return "";
  }

  const id = contract.alias.concat("-").concat(getChainId().toString()).concat("-").concat(tokenId.toString());

  return id;
}

export function getStreamByIdFromSource(tokenId: GraphBigInt): Stream | null {
  const id = generateStreamId(tokenId);
  return Stream.load(id);
}
