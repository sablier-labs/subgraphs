import { Flow as enums } from "../../../../schema/enums";
import type { SablierFlow_v1_0_RestartFlowStream_handler as Handler } from "../../bindings/src/Types.gen";
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

  // Restart is actually an adjustment
  const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
  const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
  const notWithdrawnAmount = stream.snapshotAmount - withdrawnAmount;

  const now = BigInt(event.block.timestamp);
  let depletionTime = now;
  if (availableAmount > notWithdrawnAmount) {
    const extraAmountScaled = availableAmount - notWithdrawnAmount;

    depletionTime = now + extraAmountScaled / event.params.ratePerSecond;
  }

  stream = {
    ...stream,
    depletionTime,
    lastAdjustmentTimestamp: now,
    paused: false,
    pausedAction_id: undefined,
    pausedTime: undefined,
    ratePerSecond: event.params.ratePerSecond,
  };

  /* --------------------------------- ACTION --------------------------------- */
  const action = await Store.Action.create(context, event, watcher, {
    addressA: event.params.sender,
    amountA: event.params.ratePerSecond,
    category: enums.ActionCategory.Restart,
    streamId: stream.id,
  });
  stream = {
    ...stream,
    lastAdjustmentAction_id: action.id,
  };
  context.Stream.set(stream);
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

export const restartStream = { handler, loader: Loader.base };
