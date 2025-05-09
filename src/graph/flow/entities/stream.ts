import { BigInt as BInt, dataSource } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "../../constants";
import { getChainId, getContractVersion } from "../../context";
import { getStreamAlias, getStreamId } from "../../ids";
import { getOrCreateEntityBatch } from "./batch";

import { EntityStream, EventCreate } from "../bindings";
import { getOrCreateEntityAsset } from "./asset";
import { loadOrCreateEntityWatcher } from "./watcher";

export function createEntityStreamFlow(event: EventCreate): EntityStream | null {
  const watcher = loadOrCreateEntityWatcher();

  const tokenId = event.params.streamId;

  const streamId = getStreamId(tokenId);
  const stream = new EntityStream(streamId);
  const alias = getStreamAlias(tokenId);

  /** --------------- */
  stream.chainId = getChainId();
  stream.alias = alias;
  stream.category = "Flow";
  stream.contract = dataSource.address();
  stream.creator = event.transaction.from;
  stream.depletionTime = event.block.timestamp;
  stream.hash = event.transaction.hash;
  stream.ratePerSecond = event.params.ratePerSecond; /** Scaled 18D */
  stream.recipient = event.params.recipient;
  stream.startTime = event.block.timestamp;
  stream.subgraphId = watcher.streamIndex;
  stream.sender = event.params.sender;
  stream.timestamp = event.block.timestamp;
  stream.tokenId = tokenId;
  stream.transferable = event.params.transferable;
  stream.version = getContractVersion();

  /** --------------- */
  stream.availableAmount = ZERO;
  stream.depositedAmount = ZERO;
  stream.forgivenDebt = ZERO;
  stream.refundedAmount = ZERO;
  stream.snapshotAmount = ZERO;
  stream.withdrawnAmount = ZERO;

  /** --------------- */
  stream.paused = false;
  stream.voided = false;
  stream.lastAdjustmentTimestamp = event.block.timestamp;

  /** --------------- */
  const asset = getOrCreateEntityAsset(event.params.token);
  stream.asset = asset.id;

  /** --------------- */
  const batch = getOrCreateEntityBatch(event, event.params.sender);
  stream.batch = batch.id;
  stream.position = batch.size.minus(ONE);

  watcher.streamIndex = watcher.streamIndex.plus(ONE);
  watcher.save();

  stream.save();
  return stream;
}

export function loadEntityStream(tokenId: BInt): EntityStream | null {
  const id = getStreamId(tokenId);
  return EntityStream.load(id);
}
