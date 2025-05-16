import { LockupV20, LockupV21, LockupV22, LockupV23 } from "../../generated";
import { ActionCategory } from "../constants";
import { createAction, generateStreamId, getOrCreateWatcher, getStream } from "../helpers";
import type { Action, RenounceHandler, RenounceLoader } from "../types";

async function loader(input: RenounceLoader) {
  const { context, event } = input;

  const streamId = generateStreamId(event, event.srcAddress, event.params.streamId);
  const watcherId = event.chainId.toString();

  const [stream, watcher] = await Promise.all([context.Stream.get(streamId), context.Watcher.get(watcherId)]);

  return {
    stream,
    watcher,
  };
}

async function handler(input: RenounceHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Fetch -------- */

  let watcher = loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let stream = loaded.stream ?? (await getStream(event, event.params.streamId, context.Stream.get));

  /** ------- Process -------- */

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Renounce,
    stream_id: stream.id,
  };

  watcher = post_action.watcher;

  stream = {
    ...stream,
    cancelable: false,
    renounceAction_id: action.id,
    renounceTime: BigInt(event.block.timestamp),
  };

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

LockupV20.RenounceLockupStream.handlerWithLoader({
  loader,
  handler,
});

LockupV21.RenounceLockupStream.handlerWithLoader({
  loader,
  handler,
});

LockupV22.RenounceLockupStream.handlerWithLoader({
  loader,
  handler,
});

LockupV23.RenounceLockupStream.handlerWithLoader({
  loader,
  handler,
});
