import { FlowV10 } from "../../generated";
import type { Action, RestartHandler, RestartLoader } from "../types";

import {
  createAction,
  generateStreamId,
  getOrCreateWatcher,
  getStream,
} from "../helpers";
import { ActionCategory } from "../constants";

async function loader(input: RestartLoader) {
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

async function handler(input: RestartHandler<typeof loader>) {
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
    category: ActionCategory.Restart,
    stream_id: stream.id,

    /** --------------- */
    addressA: event.params.sender.toLowerCase(),
    amountA: event.params.ratePerSecond,
  };

  watcher = post_action.watcher;

  const notWithdrawn = stream.snapshotAmount - stream.withdrawnAmount;
  let depletionTime = BigInt(event.block.timestamp);
  if (stream.availableAmount > notWithdrawn) {
    const extraAmount = stream.availableAmount - notWithdrawn;
    depletionTime =
      BigInt(event.block.timestamp) + extraAmount /event.params.ratePerSecond;
  }

  stream = {
    ...stream,
    paused: false,
    pausedTime: undefined,
    pausedAction_id: undefined,
    voided: false,
    voidedTime: undefined,
    voidedAction_id: undefined,
    /** Restart is actually an adjustment */
    lastAdjustmentAction_id: action.id,
    lastAdjustmentTimestamp: BigInt(event.block.timestamp),
    ratePerSecond: event.params.ratePerSecond,
    depletionTime,
  };

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

FlowV10.RestartFlowStream.handlerWithLoader({
  loader,
  handler,
});
