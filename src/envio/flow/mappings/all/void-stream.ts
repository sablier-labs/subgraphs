import { FlowCommon } from "@envio-flow/bindings";
import { scale } from "@envio-flow/helpers";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";
import { Loader } from "../loader";

FlowCommon.VoidFlowStream.handlerWithLoader({
  loader: Loader.base,
  handler: async ({ context, event, loaderReturn }) => {
    const watcher = loaderReturn.watcher;
    let stream = loaderReturn.stream;

    /* --------------------------------- STREAM --------------------------------- */

    // Void is actually an adjustment with the new rate set to zero.
    const now = BigInt(event.block.timestamp);
    const elapsedTime = now - stream.lastAdjustmentTimestamp;
    const streamedAmount = stream.ratePerSecond * elapsedTime;
    const snapshotAmount = stream.snapshotAmount + streamedAmount;

    const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
    const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
    const maxAvailable = withdrawnAmount + availableAmount;

    stream = {
      ...stream,
      depletionTime: 0n,
      forgivenDebt: event.params.writtenOffDebt,
      lastAdjustmentTimestamp: BigInt(event.block.timestamp),
      paused: true,
      pausedTime: BigInt(event.block.timestamp),
      ratePerSecond: 0n,
      snapshotAmount: maxAvailable < snapshotAmount ? maxAvailable : snapshotAmount,
      voided: true,
      voidedTime: BigInt(event.block.timestamp),
    };

    /* --------------------------------- ACTION --------------------------------- */
    const action = await Store.Action.create(context, event, watcher, {
      category: enums.ActionCategory.Void,
      streamId: stream.id,
      addressA: event.params.recipient,
      addressB: event.params.sender,
      amountA: event.params.newTotalDebt,
      amountB: event.params.writtenOffDebt,
    });
    stream = {
      ...stream,
      lastAdjustmentAction_id: action.id,
      pausedAction_id: action.id,
      voidedAction_id: action.id,
    };
    context.Stream.set(stream);
  },
});
