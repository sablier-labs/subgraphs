import { FlowV22 } from "../../generated";
import type { Action, RefundHandler, RefundLoader } from "../types";

import {
  createAction,
  generateStreamId,
  getOrCreateWatcher,
  getStream,
} from "../helpers";
import { ActionCategory } from "../constants";

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

  const availableAmount = stream.availableAmount - event.params.amount;
  const unpaidDebt =
    stream.snapshotAmount +
    stream.ratePerSecond *
      (BigInt(event.block.timestamp) - stream.lastAdjustmentTimestamp) -
    stream.withdrawnAmount;
  const extraAmount = stream.availableAmount - unpaidDebt;
  const depletionTime =
    BigInt(event.block.timestamp) + extraAmount / stream.ratePerSecond;

  stream = {
    ...stream,
    availableAmount,
    depletionTime,
  };

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

FlowV22.RefundFromFlowStream.handlerWithLoader({
  loader,
  handler,
});
