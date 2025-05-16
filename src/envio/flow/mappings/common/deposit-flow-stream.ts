import { Flow as enums } from "../../../../schema/enums";
import { toScaled } from "../../../common";
import type { Action, DepositHandler, DepositLoader } from "../../bindings";
import { FlowV10 } from "../../generated";
import { createAction, generateStreamId, getOrCreateWatcher, getStream } from "../../helpers";

async function loader(input: DepositLoader) {
  const { context, event } = input;

  const streamId = generateStreamId(event, event.srcAddress, event.params.streamId);
  const watcherId = event.chainId.toString();

  const [stream, watcher] = await Promise.all([context.Stream.get(streamId), context.Watcher.get(watcherId)]);

  return {
    stream,
    watcher,
  };
}

async function handler(input: DepositHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Fetch -------- */

  let watcher = loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let stream = loaded.stream ?? (await getStream(event, event.params.streamId, context.Stream.get));

  const asset = await context.Asset.get(stream.asset_id);

  if (!asset) {
    return;
  }

  /** ------- Process -------- */

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: enums.ActionCategory.Deposit,
    stream_id: stream.id,

    /** --------------- */
    addressA: event.params.funder.toLowerCase(),
    amountA: event.params.amount,
  };

  watcher = post_action.watcher;

  /** --------------- */

  const depositedAmount = stream.depositedAmount + event.params.amount;

  const availableAmount = stream.availableAmount + event.params.amount;
  const availableAmountScaled = toScaled(availableAmount, asset.decimals); /** Scaled 18D */

  const timeSinceLastSnapshot = BigInt(event.block.timestamp) - stream.lastAdjustmentTimestamp;

  const snapshotAmountScaled = stream.snapshotAmount + stream.ratePerSecond * timeSinceLastSnapshot; /** Scaled 18D */

  const withdrawnAmountScaled = toScaled(stream.withdrawnAmount, asset.decimals); /** Scaled 18D */

  const notWithdrawnScaled = snapshotAmountScaled - withdrawnAmountScaled; /** Scaled 18D */

  let depletionTime = stream.depletionTime;
  /** If the the stream still has debt mimic the contract behavior  */
  if (availableAmountScaled > notWithdrawnScaled) {
    const extraAmountScaled = availableAmountScaled - notWithdrawnScaled; /** Scaled 18D */

    if (stream.ratePerSecond > 0) {
      depletionTime = BigInt(event.block.timestamp) + extraAmountScaled / stream.ratePerSecond;
    }
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

FlowV10.DepositFlowStream.handlerWithLoader({
  loader,
  handler,
});
