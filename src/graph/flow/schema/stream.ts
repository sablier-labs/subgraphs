import { BigInt as BInt, dataSource } from "@graphprotocol/graph-ts";
import { getOrCreateBatch } from "../../batch";
import { ONE, ZERO } from "../../constants";
import { generateStreamAlias, generateStreamId } from "../../generators";
import { getChainId } from "../../getters";
import { logInfo } from "../../logger";
import { EntityContract, EntityStream, EventCreate } from "../bindings";
import { getOrCreateAsset } from "./asset";
import { getOrCreateWatcher } from "./watcher";

export function createStream(event: EventCreate): EntityStream | null {
  const watcher = getOrCreateWatcher();
  const contractId = dataSource.address().toHexString();
  const contract = EntityContract.load(contractId);
  if (contract == null) {
    logInfo("Contract not saved before this create event: {}", [contractId]);
    return null;
  }

  const tokenId = event.params.streamId;

  const streamId = generateStreamId(tokenId);
  if (streamId == null) {
    return null;
  }

  const alias = generateStreamAlias(tokenId);

  /** --------------- */
  const entity = new EntityStream(streamId);
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
  entity.refundedAmount = ZERO;
  entity.withdrawnAmount = ZERO;
  entity.availableAmount = ZERO;
  entity.depositedAmount = ZERO;
  entity.snapshotAmount = ZERO;
  entity.protocolFeeAmount = ZERO;
  entity.forgivenDebt = ZERO;

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
  entity.position = batch.size.minus(ONE);

  watcher.streamIndex = watcher.streamIndex.plus(ONE);
  watcher.save();

  entity.save();
  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function getStreamByIdFromSource(tokenId: BInt): EntityStream | null {
  const id = generateStreamId(tokenId);
  return EntityStream.load(id);
}
