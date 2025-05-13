import { BigInt, dataSource } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "../../common/constants";
import { getChainId, getContractVersion } from "../../common/context";
import { getStreamAlias, getStreamId } from "../../common/ids";
import { getOrCreateEntityBatch } from "./batch";

import { EntityStream, EventCreate } from "../bindings";
import { getOrCreateEntityAsset } from "./asset";
import { getOrCreateEntityWatcher } from "./watcher";

export function createEntityStreamFlow(event: EventCreate): EntityStream {
  const tokenId = event.params.streamId;
  const streamId = getStreamId(dataSource.address(), tokenId);
  const stream = new EntityStream(streamId);

  // Watcher
  const watcher = getOrCreateEntityWatcher();
  stream.subgraphId = watcher.streamCounter;
  watcher.streamCounter = watcher.streamCounter.plus(ONE);
  watcher.save();

  // Asset
  const asset = getOrCreateEntityAsset(event.params.token);
  stream.asset = asset.id;
  stream.assetDecimals = asset.decimals;

  // Batch
  const batch = getOrCreateEntityBatch(event, event.params.sender);
  stream.batch = batch.id;
  stream.position = batch.size.minus(ONE);

  // Stream: fields
  stream.chainId = getChainId();
  stream.alias = getStreamAlias(tokenId);
  stream.category = "Flow";
  stream.contract = event.address;
  stream.creator = event.transaction.from;
  stream.depletionTime = event.block.timestamp;
  stream.hash = event.transaction.hash;
  stream.lastAdjustmentTimestamp = event.block.timestamp;
  stream.ratePerSecond = event.params.ratePerSecond; /** Scaled 18D */
  stream.recipient = event.params.recipient;
  stream.startTime = event.block.timestamp;
  stream.sender = event.params.sender;
  stream.timestamp = event.block.timestamp;
  stream.tokenId = tokenId;
  stream.transferable = event.params.transferable;
  stream.version = getContractVersion();

  // Stream: defaults
  stream.availableAmount = ZERO;
  stream.depositedAmount = ZERO;
  stream.forgivenDebt = ZERO;
  stream.paused = false;
  stream.refundedAmount = ZERO;
  stream.snapshotAmount = ZERO;
  stream.voided = false;
  stream.withdrawnAmount = ZERO;

  stream.save();
  return stream;
}

export function loadEntityStream(tokenId: BigInt): EntityStream | null {
  const flowAddress = dataSource.address();
  const id = getStreamId(flowAddress, tokenId);
  return EntityStream.load(id);
}
