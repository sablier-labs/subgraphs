import { Flow as enums } from "../../../../schema/enums";
import type { Entity } from "../../bindings";
import { SablierFlow_v1_0 } from "../../bindings";
import { createEntityAction, getStreamOrThrow, getWatcherOrThrow } from "../../entities";

SablierFlow_v1_0.Approval.handlerWithLoader({
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
