import type { Action, VoidHandler, VoidLoader } from "../types";
import { FlowV10 } from "../../generated";
import { ActionCategory } from "../constants";
import {
  createAction,
  generateStreamId,
  getOrCreateWatcher,
  getStream,
} from "../helpers";
import { toScaled } from "../utils";

async function loader(input: VoidLoader) {
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

async function handler(input: VoidHandler<typeof loader>) {
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
    category: ActionCategory.Void,
    stream_id: stream.id,

    /** --------------- */
    addressA: event.params.recipient.toLowerCase(),
    addressB: event.params.sender.toLowerCase(),
    amountA: event.params.newTotalDebt,
    amountB: event.params.writtenOffDebt,
  };

  const timeSinceLastSnapshot =
    BigInt(event.block.timestamp) - stream.lastAdjustmentTimestamp;

  const snapshotAmountScaled =
    stream.snapshotAmount +
    stream.ratePerSecond * timeSinceLastSnapshot; /** Scaled 18D */

  const withdrawnAmountScaled = toScaled(
    stream.withdrawnAmount,
    asset.decimals,
  ); /** Scaled 18D */

  const availableAmountScaled = toScaled(
    stream.availableAmount,
    asset.decimals,
  ); /** Scaled 18D */

  const maxAvailableScaled =
    withdrawnAmountScaled + availableAmountScaled; /** Scaled 18D */

  watcher = post_action.watcher;
  stream = {
    ...stream,
    voided: true,
    paused: true,
    voidedTime: BigInt(event.block.timestamp),
    voidedAction_id: action.id,
    pausedTime: BigInt(event.block.timestamp),
    pausedAction_id: action.id,
    /** Void is actually an adjustment with the newRate per second equal to zero */
    lastAdjustmentAction_id: action.id,
    lastAdjustmentTimestamp: BigInt(event.block.timestamp),

    snapshotAmount:
      maxAvailableScaled < snapshotAmountScaled
        ? maxAvailableScaled
        : snapshotAmountScaled /** Scaled 18D */,
    forgivenDebt: event.params.writtenOffDebt,
    ratePerSecond: 0n,
    /** should be recomputed at the restart */
    depletionTime: 0n,
  };

  context.Action.set(action);
  context.Stream.set(stream);
  context.Watcher.set(watcher);
}

FlowV10.VoidFlowStream.handlerWithLoader({
  loader,
  handler,
});
