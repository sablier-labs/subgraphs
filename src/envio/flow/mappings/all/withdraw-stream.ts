import { FlowCommon } from "@envio-flow/bindings";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";

FlowCommon.WithdrawFromFlowStream.handlerWithLoader({
  /* -------------------------------------------------------------------------- */
  /*                                   LOADER                                   */
  /* -------------------------------------------------------------------------- */
  loader: async ({ context, event }) => {
    const stream = await Store.Stream.getOrThrow(context, event, event.params.streamId);
    const watcher = await Store.Watcher.getOrThrow(context, event);

    return {
      stream,
      watcher,
    };
  },
  /* -------------------------------------------------------------------------- */
  /*                                   HANDLER                                  */
  /* -------------------------------------------------------------------------- */
  handler: async ({ context, event, loaderReturn }) => {
    const watcher = loaderReturn.watcher;
    let stream = loaderReturn.stream;

    /* --------------------------------- STREAM --------------------------------- */

    stream = {
      ...stream,
      availableAmount: stream.availableAmount - event.params.withdrawAmount,
      withdrawnAmount: stream.withdrawnAmount + event.params.withdrawAmount,
    };
    context.Stream.set(stream);

    /* --------------------------------- ACTION --------------------------------- */
    await Store.Action.create(context, event, watcher, {
      category: enums.ActionCategory.Withdraw,
      streamId: stream.id,
      addressA: event.params.caller,
      addressB: event.params.to,
      amountA: event.params.withdrawAmount,
    });
  },
});
