import { FlowV10, FlowV11 } from "../../generated";
import type { Action, RefundHandler, RefundLoader } from "../types";

import {
  createAction,
  generateStreamId,
  getOrCreateWatcher,
  getStream,
} from "../helpers";
import { ActionCategory } from "../constants";
import { toScaled } from "../utils";

async function loader(input: RefundLoader) {
  const { context, event } = input;

  const streamId = generateStreamId(
    event,
    event.srcAddress,
    event.params.streamId,
  );
  const watcherId = event.chainId.toString();

  const [stream, watcher] = await Promise.all([
    context.Stream.get(streamId),
    context.Watcher.get(watcherId),
  ]);

  return {
    stream,
    watcher,
  };
}

async function handler(input: RefundHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Fetch -------- */

  let watcher =
    loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let stream =
    loaded.stream ??
    (await getStream(event, event.params.streamId, context.Stream.get));

  let asset = await context.Asset.get(stream.asset_id);

  if (!asset) {
    return;
  }

  /** ------- Process -------- */

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Refund,
    stream_id: stream.id,

    /** --------------- */
    addressA: event.params.sender.toLowerCase(),
    amountA: event.params.amount,
  };

  watcher = post_action.watcher;

  /** --------------- */

  const refundedAmount = stream.refundedAmount + event.params.amount;

  const availableAmount = stream.availableAmount - event.params.amount;
  const availableAmountScaled = toScaled(
    availableAmount,
    asset.decimals,
  ); /** Scaled 18D */

  const timeSinceLastSnapshot =
    BigInt(event.block.timestamp) - stream.lastAdjustmentTimestamp;

  const snapshotAmountScaled =
    stream.snapshotAmount +
    stream.ratePerSecond * timeSinceLastSnapshot; /** Scaled 18D */

  const withdrawnAmountScaled = toScaled(
    stream.withdrawnAmount,
    asset.decimals,
  ); /** Scaled 18D */

  const notWithdrawnScaled =
    snapshotAmountScaled - withdrawnAmountScaled; /** Scaled 18D */

  /** If refunded all the available amount the stream start accruing now  */
  const extraAmountScaled =
    availableAmountScaled - notWithdrawnScaled; /** Scaled 18D */

  let depletionTime = BigInt(event.block.timestamp);

  if (extraAmountScaled !== 0n && stream.ratePerSecond !== 0n) {
    depletionTime =
      BigInt(event.block.timestamp) + extraAmountScaled / stream.ratePerSecond;
  }

  stream = {
    ...stream,
    availableAmount,
    refundedAmount,
    depletionTime,
  };

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

FlowV10.RefundFromFlowStream.handlerWithLoader({
  loader,
  handler,
});

FlowV11.RefundFromFlowStream.handlerWithLoader({
  loader,
  handler,
});
