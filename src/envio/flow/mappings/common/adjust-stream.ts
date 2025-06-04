import { Flow as enums } from "../../../../schema/enums";
import type { SablierFlow_v1_0_AdjustFlowStream_handler as Handler } from "../../bindings/src/Types.gen";
import { scale } from "../../helpers";
import { Store } from "../../store";
import { Loader } from "./loader";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const watcher = loaderReturn.watcher;
  let stream = loaderReturn.stream;

  /* --------------------------------- STREAM --------------------------------- */
  const now = BigInt(event.block.timestamp);
  const elapsedTime = now - stream.lastAdjustmentTimestamp;
  const streamedAmount = stream.ratePerSecond * elapsedTime;
  const snapshotAmount = stream.snapshotAmount + streamedAmount;

  // The depletion time is recalculated only if the current depletion time is in the future.
  let depletionTime = stream.depletionTime;
  if (stream.depletionTime > now) {
    const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
    const notWithdrawn = snapshotAmount - withdrawnAmount;
    const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
    const extraAmount = availableAmount - notWithdrawn;
    depletionTime = now + extraAmount / event.params.newRatePerSecond;
  }

  stream = {
    ...stream,
    depletionTime,
    lastAdjustmentTimestamp: now,
    ratePerSecond: event.params.newRatePerSecond,
    snapshotAmount,
  };

  /* --------------------------------- ACTION --------------------------------- */
  const action = await Store.Action.create(context, event, watcher, {
    amountA: event.params.oldRatePerSecond,
    amountB: event.params.newRatePerSecond,
    category: enums.ActionCategory.Adjust,
    streamId: stream.id,
  });
  stream = {
    ...stream,
    lastAdjustmentAction_id: action.id,
  };
  context.Stream.set(stream);
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT;                                  */
/* -------------------------------------------------------------------------- */

export const adjustStream = { handler, loader: Loader.base };
