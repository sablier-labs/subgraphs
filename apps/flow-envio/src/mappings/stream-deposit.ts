import { FlowV22 } from "../../generated";
import type { Action, DepositHandler, DepositLoader } from "../types";

import {
  createAction,
  generateStreamId,
  getOrCreateWatcher,
  getStream,
} from "../helpers";
import { ActionCategory } from "../constants";

async function loader(input: DepositLoader) {
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

async function handler(input: DepositHandler<typeof loader>) {
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
    category: ActionCategory.Deposit,
    stream_id: stream.id,

    /** --------------- */
    addressA: event.params.funder.toLowerCase(),
    amountA: event.params.amount,
  };

  watcher = post_action.watcher;

  const availableAmount = stream.availableAmount + event.params.amount;
  const depositedAmount = stream.depositedAmount + event.params.amount;
  const unpaidDebt =
    stream.snapshotAmount +
    stream.ratePerSecond *
      (BigInt(event.block.timestamp) - stream.lastAdjustmentTimestamp) -
    stream.withdrawnAmount;

  let depletionTime = stream.depletionTime;
  // If the the stream still has debt mimic the contract behavior
  if (stream.availableAmount > unpaidDebt) {
    const extraAmount = stream.availableAmount - unpaidDebt;
    depletionTime =
      BigInt(event.block.timestamp) + extraAmount / stream.ratePerSecond;
  }

  stream = {
    ...stream,
    availableAmount,
    depositedAmount,
    depletionTime,
  };

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

FlowV22.DepositFlowStream.handlerWithLoader({
  loader,
  handler,
});
