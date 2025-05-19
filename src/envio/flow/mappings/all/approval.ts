import { SablierFlow } from "@envio/flow/bindings";
import { createEntityAction, getStreamOrThrow, getWatcherOrThrow } from "@envio/flow/entities";
import { Flow as enums } from "@src/schema/enums";

SablierFlow.Approval.handlerWithLoader({
  /* -------------------------------------------------------------------------- */
  /*                                   LOADER                                   */
  /* -------------------------------------------------------------------------- */
  loader: async ({ context, event }) => {
    const stream = await getStreamOrThrow(context, event, event.params.tokenId);
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
    const { stream, watcher } = loaded;

    await createEntityAction(context, watcher, event, {
      category: enums.ActionCategory.Approval,
      addressA: event.params.owner,
      addressB: event.params.approved,
      streamId: stream.id,
    });
  },
});
