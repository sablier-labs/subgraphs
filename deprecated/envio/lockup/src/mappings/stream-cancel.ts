import { LockupV20, LockupV21, LockupV22, LockupV23 } from "../../generated";
import { ActionCategory } from "../constants";
import { createAction, generateStreamId, getOrCreateWatcher, getStream } from "../helpers";
import type { Action, CancelHandler, CancelLoader } from "../types";

async function loader(input: CancelLoader) {
  const { context, event } = input;

  const streamId = generateStreamId(event, event.srcAddress, event.params.streamId);
  const watcherId = event.chainId.toString();

  const [stream, watcher] = await Promise.all([context.Stream.get(streamId), context.Watcher.get(watcherId)]);

  return {
    stream,
    watcher,
  };
}

async function handler(input: CancelHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Fetch -------- */

  let watcher = loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let stream = loaded.stream ?? (await getStream(event, event.params.streamId, context.Stream.get));

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Cancel,
    stream_id: stream.id,
    /** --------------- */
    addressA: event.params.sender.toLowerCase(),
    addressB: event.params.recipient.toLowerCase(),
    amountA: event.params.senderAmount,
    amountB: event.params.recipientAmount,
  };

  watcher = post_action.watcher;

  stream = {
    ...stream,
    cancelable: false,
    canceled: true,
    canceledAction_id: action.id,
    canceledTime: BigInt(event.block.timestamp),
    intactAmount: event.params.recipientAmount, // The only amount remaining in the stream is the non-withdrawn recipient amount
  };

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

LockupV20.CancelLockupStream.handlerWithLoader({
  loader,
  handler,
});

LockupV21.CancelLockupStream.handlerWithLoader({
  loader,
  handler,
});

LockupV22.CancelLockupStream.handlerWithLoader({
  loader,
  handler,
});

LockupV23.CancelLockupStream.handlerWithLoader({
  loader,
  handler,
});
