import { FlowV22 } from "../../generated";
import type { Action, WithdrawHandler, WithdrawLoader } from "../types";

import {
  createAction,
  generateStreamId,
  getOrCreateWatcher,
  getStream,
} from "../helpers";
import { ActionCategory } from "../constants";

async function loader(input: WithdrawLoader) {
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

async function handler(input: WithdrawHandler<typeof loader>) {
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
    addressA: event.params.caller.toLowerCase(),
    amountA: event.params.withdrawAmount,
  };

  watcher = post_action.watcher;
  stream = {
    ...stream,
    availableAmount: stream.availableAmount - event.params.withdrawAmount,
    withdrawnAmount: stream.withdrawnAmount + event.params.withdrawAmount,
  };

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

FlowV22.WithdrawFromFlowStream.handlerWithLoader({
  loader,
  handler,
});
