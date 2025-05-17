import { Flow as enums } from "../../../../schema/enums";
import { SablierFlow_v1_0 } from "../../bindings";
import { createEntityAction, getStreamOrThrow, getWatcherOrThrow } from "../../entities";

SablierFlow_v1_0.WithdrawFromFlowStream.handlerWithLoader({
  loader: async ({ context, event }) => {
    const stream = await getStreamOrThrow(context, event, event.params.streamId);
    const watcher = await getWatcherOrThrow(context, event);

    return {
      stream,
      watcher,
    };
  },
  handler: async ({ context, event, loaderReturn: loaded }) => {
    const { watcher } = loaded;
    let { stream } = loaded;

    /* --------------------------------- STREAM --------------------------------- */

    stream = {
      ...stream,
      availableAmount: stream.availableAmount - event.params.withdrawAmount,
      withdrawnAmount: stream.withdrawnAmount + event.params.withdrawAmount,
    };
    context.Stream.set(stream);

    /* --------------------------------- ACTION --------------------------------- */
    await createEntityAction(context, watcher, event, {
      category: enums.ActionCategory.Withdraw,
      streamId: stream.id,
      addressA: event.params.caller,
      addressB: event.params.to,
      amountA: event.params.withdrawAmount,
    });
  },
});
