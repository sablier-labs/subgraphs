import { Flow as enums } from "../../../../schema/enums";
import { toScaled } from "../../../common";
import type { Action, AdjustHandler, AdjustLoader } from "../../bindings";
import { FlowV10 } from "../../generated";
import { createAction, generateStreamId, getOrCreateWatcher, getStream } from "../../helpers";

async function loader(input: AdjustLoader) {
  const { context, event } = input;

  const streamId = generateStreamId(event, event.srcAddress, event.params.streamId);
  const watcherId = event.chainId.toString();

  const [stream, watcher] = await Promise.all([context.Stream.get(streamId), context.Watcher.get(watcherId)]);

  return {
    stream,
    watcher,
  };
}

async function handler(input: AdjustHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Fetch -------- */

  let watcher = loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let stream = loaded.stream ?? (await getStream(event, event.params.streamId, context.Stream.get));

  const asset = await context.Asset.get(stream.asset_id);

  if (!asset) {
    return;
  }

  /** ------- Process -------- */

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: enums.ActionCategory.Adjust,
    stream_id: stream.id,

    /** --------------- */
    amountA: event.params.oldRatePerSecond /** [Scaled 18D] */,
    amountB: event.params.newRatePerSecond /** [Scaled 18D] */,
  };

  watcher = post_action.watcher;

  /** --------------- */

  const timeSinceLastSnapshot = BigInt(event.block.timestamp) - stream.lastAdjustmentTimestamp;

  const snapshotAmountScaled = stream.snapshotAmount + stream.ratePerSecond * timeSinceLastSnapshot; /** Scaled 18D */

  /** The depletionTime should be recalculated only if it is the future at the event time (meaning extra amount exists inside the stream)*/

  let depletionTime = stream.depletionTime;

  if (stream.depletionTime > BigInt(event.block.timestamp)) {
    const withdrawnAmountScaled = toScaled(stream.withdrawnAmount, asset.decimals); /** Scaled 18D */

    const notWithdrawnScaled = snapshotAmountScaled - withdrawnAmountScaled; /** Scaled 18D */

    const availableAmountScaled = toScaled(stream.availableAmount, asset.decimals); /** Scaled 18D */

    const extraAmountScaled = availableAmountScaled - notWithdrawnScaled; /** Scaled 18D */

    depletionTime = BigInt(event.block.timestamp) + extraAmountScaled / event.params.newRatePerSecond;
  }

  stream = {
    ...stream,
    depletionTime,
    snapshotAmount: snapshotAmountScaled /** Scaled 18D */,
    lastAdjustmentAction_id: action.id,
    ratePerSecond: event.params.newRatePerSecond /** Scaled 18D */,
    lastAdjustmentTimestamp: BigInt(event.block.timestamp),
  };

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

FlowV10.AdjustFlowStream.handlerWithLoader({
  loader,
  handler,
});
