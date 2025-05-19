import { SablierFlow } from "@envio/flow/bindings";
import { createEntityAction, getStreamOrThrow, getWatcherOrThrow } from "@envio/flow/entities";
import { Flow as enums } from "@src/schema/enums";

SablierFlow.WithdrawFromFlowStream.handlerWithLoader({
  /* -------------------------------------------------------------------------- */
  /*                                   LOADER                                   */
  /* -------------------------------------------------------------------------- */
  loader: async ({ context, event }) => {
    const stream = await getStreamOrThrow(context, event, event.params.streamId);
    const watcher = await getWatcherOrThrow(context, event);

    return {
      stream,
      watcher,
    };
  },
  /* -------------------------------------------------------------------------- */
  /*                                   HANDLER                                  */
  /* -------------------------------------------------------------------------- */
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
