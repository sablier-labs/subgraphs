import type { Action, WithdrawHandler, WithdrawLoader } from "../types";
import { LockupV20, LockupV21, LockupV22, LockupV23 } from "../../generated";
import { ActionCategory } from "../constants";
import {
  createAction,
  generateStreamId,
  getOrCreateWatcher,
  getStream,
} from "../helpers";

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

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Withdraw,
    stream_id: stream.id,

    /** --------------- */
    addressA: event.transaction.from?.toLowerCase() || "",
    addressB: event.params.to.toLowerCase(),
    amountB: event.params.amount,
  };

  watcher = post_action.watcher;

  /** --------------- */

  const amount = event.params.amount;
  const withdrawn = stream.withdrawnAmount + amount;

  stream = {
    ...stream,
    withdrawnAmount: withdrawn,
  };

  if (stream.canceledAction_id) {
    stream = {
      ...stream,
      intactAmount: stream.intactAmount - amount, // The intact amount (recipient) has been set in the cancel action, now subtract
    };
  } else {
    stream = {
      ...stream,
      intactAmount: stream.depositAmount - withdrawn,
    };
  }

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

LockupV20.WithdrawFromLockupStream.handlerWithLoader({
  loader,
  handler,
});

LockupV21.WithdrawFromLockupStream.handlerWithLoader({
  loader,
  handler,
});

LockupV22.WithdrawFromLockupStream.handlerWithLoader({
  loader,
  handler,
});

LockupV23.WithdrawFromLockupStream.handlerWithLoader({
  loader,
  handler,
});
