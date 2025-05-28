import { BigInt, dataSource } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "../../common/constants";
import { readChainId, readContractVersion } from "../../common/context";
import { Id } from "../../common/id";
import { EntityStream, EventCreate } from "../bindings";
import { getOrCreateAsset } from "./entity-asset";
import { getOrCreateBatch } from "./entity-batch";
import { getOrCreateWatcher } from "./entity-watcher";

export function createStream(event: EventCreate): EntityStream {
  const tokenId = event.params.streamId;
  const streamId = Id.stream(dataSource.address(), tokenId);
  const stream = new EntityStream(streamId);
  const watcher = getOrCreateWatcher();
  stream.subgraphId = watcher.streamCounter;
  stream.tokenId = tokenId;

  /* --------------------------------- ASSET --------------------------------- */
  const asset = getOrCreateAsset(event.params.token);
  stream.asset = asset.id;
  stream.assetDecimals = asset.decimals;

  /* --------------------------------- BATCH --------------------------------- */
  const batch = getOrCreateBatch(event, event.params.sender);
  stream.batch = batch.id;
  stream.position = batch.size.minus(ONE);

  /* ------------------------------ STREAM: PARAMS ------------------------------ */
  stream.chainId = readChainId();
  stream.alias = Id.streamAlias(tokenId);
  stream.category = "Flow";
  stream.contract = event.address;
  stream.creator = event.transaction.from;
  stream.depletionTime = event.block.timestamp;
  stream.hash = event.transaction.hash;
  stream.lastAdjustmentTimestamp = event.block.timestamp;
  stream.ratePerSecond = event.params.ratePerSecond;
  stream.recipient = event.params.recipient;
  stream.startTime = event.block.timestamp;
  stream.sender = event.params.sender;
  stream.timestamp = event.block.timestamp;
  stream.transferable = event.params.transferable;
  stream.version = readContractVersion();

  /* ------------------------------ STREAM: DEFAULTS ----------------------------- */
  stream.availableAmount = ZERO;
  stream.depositedAmount = ZERO;
  stream.forgivenDebt = ZERO;
  stream.paused = false;
  stream.refundedAmount = ZERO;
  stream.snapshotAmount = ZERO;
  stream.voided = false;
  stream.withdrawnAmount = ZERO;
  stream.save();

  /* --------------------------------- WATCHER -------------------------------- */
  stream.subgraphId = watcher.streamCounter;
  watcher.streamCounter = watcher.streamCounter.plus(ONE);
  watcher.save();

  return stream;
}

export function getStream(tokenId: BigInt): EntityStream | null {
  const flowAddress = dataSource.address();
  const id = Id.stream(flowAddress, tokenId);
  return EntityStream.load(id);
}
