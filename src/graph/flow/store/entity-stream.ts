import { BigInt, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "../../common/constants";
import { readChainId, readContractVersion } from "../../common/context";
import { Id } from "../../common/id";
import { EntityStream } from "../bindings";
import { Params } from "../helpers/types";
import { getOrCreateAsset } from "./entity-asset";
import { getOrCreateBatch } from "./entity-batch";
import { getOrCreateWatcher } from "./entity-watcher";

export function createStream(event: ethereum.Event, params: Params.CreateFlowStream): EntityStream {
  const chainId = readChainId();
  const tokenId = params.streamId;
  const streamId = Id.stream(dataSource.address(), tokenId);
  const stream = new EntityStream(streamId);
  const watcher = getOrCreateWatcher();

  /* --------------------------------- WATCHER -------------------------------- */
  stream.subgraphId = watcher.streamCounter;
  watcher.streamCounter = watcher.streamCounter.plus(ONE);
  watcher.save();

  /* --------------------------------- ASSET --------------------------------- */
  const asset = getOrCreateAsset(params.token);
  stream.asset = asset.id;
  stream.assetDecimals = asset.decimals;

  /* --------------------------------- BATCH --------------------------------- */
  const batch = getOrCreateBatch(event, params.sender);
  stream.batch = batch.id;
  stream.position = batch.size.minus(ONE);

  /* ------------------------------ STREAM: PARAMS ------------------------------ */
  stream.alias = Id.streamAlias(chainId, tokenId);
  stream.category = "Flow";
  stream.chainId = chainId;
  stream.contract = event.address;
  stream.creator = event.transaction.from;
  stream.depletionTime = event.block.timestamp;
  stream.hash = event.transaction.hash;
  stream.lastAdjustmentTimestamp = event.block.timestamp;
  stream.ratePerSecond = params.ratePerSecond;
  stream.recipient = params.recipient;
  stream.startTime = event.block.timestamp;
  stream.sender = params.sender;
  stream.timestamp = event.block.timestamp;
  stream.tokenId = tokenId;
  stream.transferable = params.transferable;
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

  return stream;
}

export function getStream(tokenId: BigInt): EntityStream | null {
  const flowAddress = dataSource.address();
  const id = Id.stream(flowAddress, tokenId);
  return EntityStream.load(id);
}
