import { SablierFlow_v1_0, SablierFlow_v1_1 } from "@envio-flow/bindings";
import type { SablierFlow_v1_0_RestartFlowStream_handler as Handler } from "@envio-flow/bindings/src/Types.gen";
import { scale } from "@envio-flow/helpers";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";
import { Loader } from "../loader";

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
    paused: false,
    pausedTime: undefined,
    pausedAction_id: undefined,
    lastAdjustmentTimestamp: now,
    ratePerSecond: event.params.ratePerSecond,
    depletionTime,
  };

  /* --------------------------------- ACTION --------------------------------- */
  const action = await Store.Action.create(context, event, watcher, {
    category: enums.ActionCategory.Restart,
    addressA: event.params.sender,
    amountA: event.params.ratePerSecond,
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

const handlerWithLoader = { loader: Loader.base, handler };

SablierFlow_v1_0.RestartFlowStream.handlerWithLoader(handlerWithLoader);

SablierFlow_v1_1.RestartFlowStream.handlerWithLoader(handlerWithLoader);
