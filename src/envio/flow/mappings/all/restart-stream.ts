import { FlowCommon } from "@envio-flow/bindings";
import { scale } from "@envio-flow/helpers";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";
import { Loader } from "../loader";

FlowCommon.RestartFlowStream.handlerWithLoader({
  loader: Loader.base,
  handler: async ({ context, event, loaderReturn }) => {
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
  },
});
