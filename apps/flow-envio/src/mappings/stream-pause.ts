import { FlowV10 } from "../../generated";
import type { Action, PauseHandler, PauseLoader } from "../types";

import {
  createAction,
  generateStreamId,
  getOrCreateWatcher,
  getStream,
} from "../helpers";
import { ActionCategory } from "../constants";

async function loader(input: PauseLoader) {
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

async function handler(input: PauseHandler<typeof loader>) {
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
    category: ActionCategory.Pause,
    stream_id: stream.id,

    /** --------------- */
    addressA: event.params.recipient.toLowerCase(),
    addressB: event.params.sender.toLowerCase(),
    amountA: event.params.totalDebt,
  };

  watcher = post_action.watcher;

  const snapshotAmount =
    stream.snapshotAmount +
    stream.ratePerSecond *
      (BigInt(event.block.timestamp) - stream.lastAdjustmentTimestamp);

  stream = {
    ...stream,
    paused: true,
    pausedTime: BigInt(event.block.timestamp),
    pausedAction_id: action.id,
    lastAdjustmentAction_id: action.id,
    lastAdjustmentTimestamp: BigInt(event.block.timestamp),
    snapshotAmount,
    ratePerSecond: 0n,
  };

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

FlowV10.PauseFlowStream.handlerWithLoader({
  loader,
  handler,
});
