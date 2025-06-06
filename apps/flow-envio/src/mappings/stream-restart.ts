import { FlowV10, FlowV11 } from "../../generated";
import type { Action, RestartHandler, RestartLoader } from "../types";

import {
  createAction,
  generateStreamId,
  getOrCreateWatcher,
  getStream,
} from "../helpers";
import { ActionCategory } from "../constants";
import { toScaled } from "../utils";

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

  let asset = await context.Asset.get(stream.asset_id);

  if (!asset) {
    return;
  }
  /** ------- Process -------- */

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Restart,
    stream_id: stream.id,

    /** --------------- */
    addressA: event.params.sender.toLowerCase(),
    amountA: event.params.ratePerSecond /** Scaled 18D */,
  };

  watcher = post_action.watcher;

  const withdrawnAmountScaled = toScaled(
    stream.withdrawnAmount,
    asset.decimals,
  ); /** Scaled 18D */

  const notWithdrawnScaled =
    stream.snapshotAmount - withdrawnAmountScaled; /** Scaled 18D */

  const availableAmountScaled = toScaled(
    stream.availableAmount,
    asset.decimals,
  ); /** Scaled 18D */

  let depletionTime = BigInt(event.block.timestamp);
  if (availableAmountScaled > notWithdrawnScaled) {
    const extraAmountScaled =
      availableAmountScaled - notWithdrawnScaled; /** Scaled 18D */

    depletionTime =
      BigInt(event.block.timestamp) +
      extraAmountScaled / event.params.ratePerSecond;
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
    ratePerSecond: event.params.ratePerSecond /** Scaled 18D */,
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

FlowV11.RestartFlowStream.handlerWithLoader({
  loader,
  handler,
});
