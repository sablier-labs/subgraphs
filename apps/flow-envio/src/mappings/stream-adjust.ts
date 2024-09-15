import { FlowV22 } from "../../generated";
import type { Action, AdjustHandler, AdjustLoader } from "../types";

import {
  createAction,
  generateStreamId,
  getOrCreateWatcher,
  getStream,
} from "../helpers";
import { ActionCategory } from "../constants";

async function loader(input: AdjustLoader) {
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

async function handler(input: AdjustHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Fetch -------- */

  let watcher =
    loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let stream =
    loaded.stream ??
    (await getStream(event, event.params.streamId, context.Stream.get));

  /** ------- Process -------- */

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Adjust,
    stream_id: stream.id,

    /** --------------- */
    amountA: event.params.oldRatePerSecond,
    amountB: event.params.newRatePerSecond,
  };

  watcher = post_action.watcher;

  const snapshotAmount =
    stream.snapshotAmount +
    stream.ratePerSecond *
      (BigInt(event.block.timestamp) - stream.lastAdjustmentTimestamp);
  let depletionTime = stream.depletionTime;
  // The depletionTime should be recalculated only if it is the future at the event time (meaning extra amount exists inside the stream)
  if (stream.depletionTime > BigInt(event.block.timestamp)) {
    const unpaidDebt = snapshotAmount - stream.withdrawnAmount;
    const extraAmount = stream.availableAmount - unpaidDebt;
    depletionTime =
      BigInt(event.block.timestamp) +
      extraAmount / event.params.newRatePerSecond;
  }

  stream = {
    ...stream,
    depletionTime,
    snapshotAmount,
    lastAdjustmentAction_id: action.id,
    ratePerSecond: event.params.newRatePerSecond,
    lastAdjustmentTimestamp: BigInt(event.block.timestamp),
  };

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

FlowV22.AdjustFlowStream.handlerWithLoader({
  loader,
  handler,
});
