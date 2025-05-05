import { LockupV20, LockupV21, LockupV22, LockupV23 } from "../../generated";
import { ADDRESS_ZERO, ActionCategory } from "../constants";
import { createAction, generateStreamId, getOrCreateWatcher, getStream } from "../helpers";
import type { Action, TransferHandler, TransferLoader } from "../types";

async function loader(input: TransferLoader) {
  const { context, event } = input;

  const streamId = generateStreamId(event, event.srcAddress, event.params.tokenId);
  const watcherId = event.chainId.toString();

  const [stream, watcher] = await Promise.all([context.Stream.get(streamId), context.Watcher.get(watcherId)]);

  return {
    stream,
    watcher,
  };
}

async function handler(input: TransferHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /**
   * As described in issue #18, we will first filter out
   * any `Transfer` events emitted by the initial mint transaction
   */

  if (event.params.from.toLowerCase() === ADDRESS_ZERO.toLowerCase()) {
    return;
  }

  /** ------- Fetch -------- */

  let watcher = loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let stream = loaded.stream ?? (await getStream(event, event.params.tokenId, context.Stream.get));

  /** ------- Process -------- */

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Transfer,
    stream_id: stream.id,

    /** --------------- */
    addressA: event.params.from.toLowerCase(),
    addressB: event.params.to.toLowerCase(),
  };

  watcher = post_action.watcher;

  stream = {
    ...stream,
    recipient: event.params.to.toLowerCase(),
    parties: [stream.sender, event.params.to.toLowerCase()],
  };

  if (stream.proxied) {
    if (stream.proxender) {
      stream = {
        ...stream,
        parties: [...stream.parties, stream.proxender],
      };
    }
  }

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

LockupV20.Transfer.handlerWithLoader({
  loader,
  handler,
});

LockupV21.Transfer.handlerWithLoader({
  loader,
  handler,
});

LockupV22.Transfer.handlerWithLoader({
  loader,
  handler,
});

LockupV23.Transfer.handlerWithLoader({
  loader,
  handler,
});
